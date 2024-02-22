import { Module } from '@nestjs/common';
import { Enhancer, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      // playground: false,
      useFactory: (config: ConfigService) => ({
        debug: config.get('GRAPHQL_DEBUG') === 'true',
        playground: config.get('GRAPHQL_PLAYGROUND') === 'true',
        autoSchemaFile: join(process.cwd(), 'src/conf/schema.gql'),
        sortSchema: true,
        fieldResolverEnhancers: ['interceptors'] as Enhancer[],
        autoTransformHttpErrors: true,
        context: (context) => context,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AppResolver, AppService],
})
export class AppModule {}
