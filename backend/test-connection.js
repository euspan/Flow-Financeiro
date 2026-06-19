const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log('🔧 DNS servers configurados para:', dns.getServers());

console.log('🔍 Tentando conectar ao MongoDB...');
console.log('URI:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':***@'));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('\n✅ Conexão com MongoDB Atlas realizada com sucesso!');
    console.log('Database Host:', mongoose.connection.host);
    console.log('Database Name:', mongoose.connection.name || 'Não especificado');
    console.log('\nFechando conexão...');
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✅ Conexão fechada com sucesso!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Erro ao conectar ao MongoDB:');
    console.error('Mensagem:', err.message);
    if (err.stack) {
      console.error('Stack:', err.stack);
    }
    process.exit(1);
  });
