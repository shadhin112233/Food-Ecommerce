import mongoose from 'mongoose';

const uri = 'mongodb+srv://shadhin:shadhin1122@cluster0.a47amar.mongodb.net/Food-ecommerce';

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.Mixed,
  items: Array,
  amount: Number,
  address: Object,
  status: String,
  date: Date,
  payment: Boolean
});

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

async function main(){
  try{
    await mongoose.connect(uri,{dbName:'Food-ecommerce'});
    const orders = await Order.find().limit(50).lean();
    console.log('orders count', orders.length);
    orders.forEach(o => {
      console.log(JSON.stringify({
        _id: o._id?.toString(),
        userId: o.userId,
        userIdType: typeof o.userId,
        payment: o.payment,
        amount: o.amount
      }));
    });
    await mongoose.disconnect();
  }catch(e){
    console.error('error:', e);
    process.exit(1);
  }
}

main();
