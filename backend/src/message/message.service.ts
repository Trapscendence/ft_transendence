import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/users/models/user.medel';
import { schema } from 'src/utils/envs';
import { sqlEscaper } from 'src/utils/sqlescaper.utils';
import { DM, Message } from './model/message.model';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDM(user_id: string, other_user: string): Promise<DM[]> {
    return await this.databaseService.executeQuery(`
SELECT
  sender_id AS user_id,
  ${other_user} AS other_id,
  check_date AS checked_date
FROM
  ${schema}.dm
WHERE
  sender_id = ${user_id}
    AND
  receiver_id = ${other_user};
    `);
  }

  async getMessages(
    user_id: string,
    other_user: string,
    offset: number,
    limit: number,
  ): Promise<Message[]> {
    return await this.databaseService.executeQuery(`
  SELECT
    m.id,
    false AS received,
    m.dm_text AS content,
    m.time_stamp,
    true AS checked
  FROM
    ${schema}.message m,
    (
      SELECT
        d.id
      FROM
        ${schema}.dm d
      WHERE
        sender_id = ${user_id}
          AND
        receiver_id = ${other_user}
    ) AS d
  WHERE
    d.dm_id = d.id
UNION
  SELECT
    m.id,
    false
      AS received,
    m.dm_text
      AS content,
    m.time_stamp,
    CASE
      WHEN
        m.time_stamp < d.check_date
      THEN
        false
      ELSE
        true
    END
      AS checked
  FROM
    ${schema}.message m,
    (
      SELECT
        d.id,
        d.check_date
      FROM
        ${schema}.dm d
      WHERE
        sender_id = ${user_id}
          AND
        receiver_id = ${other_user}
    ) d
  WHERE
    m.dm_id = d.id
ORDER BY
  time_stamp DESC
OFFSET
  ${offset} ROWS
FETCH NEXT
  ${limit} ROWS ONLY;
    `);
  }

  async getDmUsers(
    user_id: string,
    offset: number,
    limit: number,
  ): Promise<User[]> {
    return await this.databaseService.executeQuery(`
SELECT
  u.id,
  u.nickname,
  u.avatar,
  u.status_message,
  u.rank_score,
  u.site_role,
  s.time_stamp,
  s.checked
FROM
  (
    SELECT
      DISTINCT ON (t.my_id) my_id,
      t.other_id other_id,
      t.time_stamp time_stamp,
      t.checked checked
    FROM
    (
        SELECT
          d.sender_id my_id,
          d.receiver_id other_id,
          GREATEST(m.time_stamp) time_stamp,
          false checked
        FROM
          ${schema}.dm d
        INNER JOIN
          ${schema}.message m
            ON
              m.dm_id = d.id
        WHERE
          d.sender_id = ${user_id}
      UNION
        SELECT
          d.receiver_id my_id,
          d.sender_id other_id,
          GREATEST(m.time_stamp) time_stamp,
          CASE
            WHEN
              m.time_stamp > d.check_date
            THEN
              true
            else
              false
          END checked
        FROM
          ${schema}.dm d
        INNER JOIN
          ${schema}.message m
            ON
              m.dm_id = d.id
        WHERE
          d.receiver_id = ${user_id}
    ) t
    ORDER BY
      t.my_id,
      t.time_stamp DESC
  ) s
INNER JOIN
  ${schema}.user u
    ON
      u.id = s.other_id
ORDER BY
  s.checked DESC,
  s.time_stamp DESC;
    `);
  }

  async insertMessage(
    user_id: string,
    other_id: string,
    text: string,
  ): Promise<boolean> {
    text = sqlEscaper(text);
    const array = await this.databaseService.executeQuery(`
INSERT INTO
  ${schema}.message(
    dm_id,
    dm_text,
    time_stamp
  )
SELECT
  d.id dm_id,
  '${text}' dm_text,
  ${new Date().getTime()} time_stamp
FROM
  (
    SELECT
      d.id id
    FROM
      ${schema}.dm d
    WHERE
      d.sender_id = ${user_id}
        AND
      d.receiver_id = ${other_id}
  ) d
RETURNING
  *;
    `);
    return array.length === 0 ? false : true;
  }
}
