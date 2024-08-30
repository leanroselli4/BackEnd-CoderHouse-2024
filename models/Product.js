// models/Product.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  category: String,
  description: String,
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product;
