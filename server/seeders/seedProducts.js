import Product from '../models/Product.js';
import { initialProducts } from './initialProducts.js';

export const seedProducts = async () => {
  try {
    console.log('🌱 Проверка наличия товаров в базе...');
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const productData of initialProducts) {
      const existingProduct = await Product.findOne({
        where: { name: productData.name }
      });
      
      if (!existingProduct) {
        await Product.create(productData);
        addedCount++;
        console.log(`✅ Добавлен: ${productData.name}`);
      } else {
        skippedCount++;
        console.log(`⏭️ Уже существует: ${productData.name}`);
      }
    }
    
    console.log(`📊 Итог: добавлено ${addedCount}, пропущено ${skippedCount}`);
  } catch (error) {
    console.error('❌ Ошибка при заполнении товаров:', error);
  }
};