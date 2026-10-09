import { Controller, Get, Post, Render, Query, Body} from '@nestjs/common';
import { AppService } from './app.service.js';
import { Product } from './Product.js';
import { CreateProductDto } from './CreateProductDto.dto.js';
import * as fs from 'fs'
import { title } from 'process';


@Controller()
export class AppController {
  private productDB: Product[] = JSON.parse(fs.readFileSync('./src/products.json', "utf-8"))
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'Welcome to the Webshop',
      data: this.productDB.toSorted((a,b) => a.price - b.price)
      //Alulról, vagy felülről kell hogy növekednie?

    }
  }

  @Get('filter')
  @Render('filter')
  getFilter(@Query('catFilter') catFilter? : string ){
    return{
      title: "Filter by Category",
      data: this.productDB.filter((a) => a.category.toLocaleLowerCase().includes(catFilter?.toLocaleLowerCase() || '')).toSorted((a, b) => b.category.localeCompare(a.category))
    }
  }

  @Get('newItem')
  @Render('newItem')
  getNewItem(){
    return{
      title: "Add new Item",
      message: "",
      data: this.productDB
    }
  }

  @Post('newItem')
  @Render('newItem')
  getNewItemForm(@Body() body: CreateProductDto) {
    const formData = {
      name: body?.name ?? '',
      category: body?.category ?? '',
      price: body?.price ?? '',
      stock: body?.stock ?? ''
    };

    const newProduct: Product = {
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock)
    };
    this.productDB.push(newProduct);

    return {
      title: 'Add new Item',
      message: 'New item creation is successfull!',
      data: this.productDB,
    };

  }
}
