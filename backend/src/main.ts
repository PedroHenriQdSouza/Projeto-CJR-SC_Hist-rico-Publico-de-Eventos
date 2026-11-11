import 'reflect-metadata'
import { Controller, Get, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

const demo = (entidade: string, campos: string[]) => ({
  entidade, campos, demonstracao: true, persistencia: 'LocalStorage no frontend',
})

@Controller('acervo')
class AcervoController {
  @Get('edicoes') edicoes() { return demo('edicoes', ['id', 'ano', 'temaId', 'categoriaIds']) }
  @Get('temas') temas() { return demo('temas', ['id', 'titulo', 'categoriaIds', 'blocos']) }
  @Get('categorias') categorias() { return demo('categorias', ['id', 'titulo', 'descricao']) }
  @Get('linha-do-tempo') marcos() { return demo('marcos_historicos', ['id', 'ano', 'titulo']) }
}

@Controller('editorial')
class EditorialController {
  @Get('publicacoes') publicacoes() { return demo('noticias', ['id', 'titulo', 'status', 'blocos']) }
  @Get('editais') editais() { return demo('editais', ['id', 'ano', 'url']) }
  @Get('parceiros') parceiros() { return demo('parceiros', ['id', 'titulo', 'capa']) }
}

@Controller('health')
class HealthController {
  @Get() status() { return { status: 'ok', demonstracao: true } }
}

@Module({ controllers: [AcervoController] })
class AcervoModule {}

@Module({ controllers: [EditorialController] })
class EditorialModule {}

@Module({ imports: [AcervoModule, EditorialModule], controllers: [HealthController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  await app.listen(Number(process.env.PORT ?? 3000), '127.0.0.1')
}
void bootstrap()
