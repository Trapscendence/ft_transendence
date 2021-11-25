import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { GraphQLModule } from '@nestjs/graphql';
import { AchivementsModule } from './achivements/achivements.module';
import { MessageModule } from './message/message.module';
import { join } from 'path';
import { PubSubModule } from './pubsub.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: {
        subscriptionEndpoint: 'ws://localhost:7000/subscriptions',
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        // NOTE: production에선 grapqh-ws를 켜야함
        // 'graphql-ws': {
        //   onConnect: (ctx: Context<unknown>) => {
        //     console.log(ctx.connectionParams.authrization);
        //   },
        // },
        'subscriptions-transport-ws': {
          path: '/subscriptions',
          onConnect: (connectionParams, webSocket, context) => {
            if (connectionParams.authorization) {
              return connectionParams;
            }
          },
        },
      },
    }),
    DatabaseModule,
    UsersModule,
    MessageModule,
    ChannelsModule,
    AchivementsModule,
    PubSubModule,
    AuthModule,
    GamesModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, AppService],
})
export class AppModule {}
