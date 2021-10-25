import { Query, Args, Int, Resolver, Mutation, ID, Info, ResolveField, Parent } from '@nestjs/graphql';
import { identity } from 'rxjs';
import { Match } from 'src/matchs/models/match.model';
import { User } from './models/user.medel';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return await this.usersService.getUser(id);
  }

  @Query((returns) => [User], { nullable: true }) // 이렇게 하나?
  async users(
    @Args('ladder') ladder: boolean,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number
    ): Promise<any> {
      return await this.usersService.getUsers(ladder, offset, limit); // NOTE 임시
  }

  @Mutation((returns) => User)
  async createUser(@Args('nickname') nickname: string): Promise<User> {
    const users = await this.usersService.createUser(nickname);
    return users[0];
  }

  // SECTION
  // 친구 관리... 여기서 하나?

  @Mutation((returns) => Boolean)
  async addFriend(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string
    ): Promise<boolean> { // NOTE 여기서 할것인가?
    return this.usersService.addFriend(user_id, friend_id)
  }

  @Mutation((returns) => User)
  async deleteFriend(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('frined_id', { type: () => ID }) friend_id: string
    ): Promise<boolean> {
    return await this.usersService.deleteFriend(user_id, friend_id)
  }

  @Mutation((returns) => User)
  async addToBlackLIst(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string
    ): Promise<User> {
    return await this.usersService.addToBlackList(user_id, black_id)
  }

  @Mutation((returns) => User)
  async deleteFromBlackList(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string
    ): Promise<User> { // NOTE 여기서 할것인가?
    return await this.usersService.deleteFromBlackList(user_id, black_id)
  }

  @ResolveField('friends', (returns) => [User])
  async getFriends(@Parent() user: User): Promise<User[]> {
    const { id } = user;
    return await this.usersService.getFriends(id);
  }

  @ResolveField('blacklist', (returns) => [User])
  async getBlackList(@Parent() user: User): Promise<User[]> {
    const { id } = user;
    return await this.usersService.getBlackList(id);
  }

  // @ResolveField('match_history', (returns) => [Match])
  // async getMatchHistory(@Parent() user: User): Promise<Match[]> {
  //   const { id } = user;
  //   return await this.matchService
  // }

}
