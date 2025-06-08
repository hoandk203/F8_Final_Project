import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Put,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { CreateDto, UpdateDto } from './material.dto';
import { MaterialService } from './material.service';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('material')
export class MaterialController {
    constructor(private materialService: MaterialService) {}

    // Public endpoint for home page
    @Get('/public')
    getPublicMaterials() {
        return this.materialService.getPublicMaterials();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    getAll() {
        return this.materialService.getList();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search')
    search(@Query('name') name: string) {
        return this.materialService.searchByName(name);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.materialService.getOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    create(@Body() createDto: CreateDto) {
        return this.materialService.create(createDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
        return this.materialService.update(id, updateDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.materialService.delete(id);
    }

    
}
