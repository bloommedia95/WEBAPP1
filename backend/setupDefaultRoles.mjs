import mongoose from 'mongoose';
import Permission from './models/Permission.js';

mongoose.connect('mongodb://localhost:27017/dashtar')
  .then(async () => {
    console.log('📦 Connected to database');
    
    // Create default role templates
    const roleTemplates = [
      {
        role: 'admin',
        isTemplate: true,
        permissions: {
          dashboard: { view: true, export: false },
          products: { view: true, create: true, edit: true, delete: false, export: true },
          categories: { view: true, create: true, edit: true, delete: false, export: true },
          attributes: { view: true, create: true, edit: true, delete: false, export: false },
          blogs: { view: true, create: true, edit: true, delete: false, export: false },
          orders: { view: true, create: false, edit: true, delete: false, export: true },
          transactions: { view: true, create: false, edit: false, delete: false, export: true },
          coupons: { view: true, create: true, edit: true, delete: false, export: true },
          customers: { view: true, create: true, edit: true, delete: false, export: true },
          team: { view: false, create: false, edit: false, delete: false, export: false },
          languages: { view: false, create: false, edit: false, delete: false, export: false },
          currencies: { view: false, create: false, edit: false, delete: false, export: false },
          invoice: { view: true, create: true, edit: true, delete: false, export: true },
          media: { view: true, create: true, edit: true, delete: false, export: true },
          reports: { view: true, create: false, edit: false, delete: false, export: true },
          themes: { view: false, create: false, edit: false, delete: false, export: false },
          roles: { view: false, create: false, edit: false, delete: false, export: false }
        }
      },
      {
        role: 'manager',
        isTemplate: true,
        permissions: {
          dashboard: { view: true, export: false },
          products: { view: true, create: false, edit: false, delete: false, export: false },
          categories: { view: true, create: false, edit: false, delete: false, export: false },
          attributes: { view: false, create: false, edit: false, delete: false, export: false },
          blogs: { view: false, create: false, edit: false, delete: false, export: false },
          orders: { view: true, create: false, edit: false, delete: false, export: false },
          transactions: { view: true, create: false, edit: false, delete: false, export: false },
          coupons: { view: false, create: false, edit: false, delete: false, export: false },
          customers: { view: true, create: false, edit: false, delete: false, export: false },
          team: { view: false, create: false, edit: false, delete: false, export: false },
          languages: { view: false, create: false, edit: false, delete: false, export: false },
          currencies: { view: false, create: false, delete: false, export: false },
          invoice: { view: false, create: false, edit: false, delete: false, export: false },
          media: { view: false, create: false, edit: false, delete: false, export: false },
          reports: { view: false, create: false, edit: false, delete: false, export: false },
          themes: { view: false, create: false, edit: false, delete: false, export: false },
          roles: { view: false, create: false, edit: false, delete: false, export: false }
        }
      },
      {
        role: 'editor',
        isTemplate: true,
        permissions: {
          dashboard: { view: true, export: false },
          products: { view: true, create: true, edit: true, delete: false, export: false },
          categories: { view: true, create: false, edit: false, delete: false, export: false },
          attributes: { view: false, create: false, edit: false, delete: false, export: false },
          blogs: { view: true, create: true, edit: true, delete: false, export: false },
          orders: { view: false, create: false, edit: false, delete: false, export: false },
          transactions: { view: false, create: false, edit: false, delete: false, export: false },
          coupons: { view: false, create: false, edit: false, delete: false, export: false },
          customers: { view: false, create: false, edit: false, delete: false, export: false },
          team: { view: false, create: false, edit: false, delete: false, export: false },
          languages: { view: false, create: false, edit: false, delete: false, export: false },
          currencies: { view: false, create: false, edit: false, delete: false, export: false },
          invoice: { view: false, create: false, edit: false, delete: false, export: false },
          media: { view: true, create: true, edit: true, delete: false, export: false },
          reports: { view: false, create: false, edit: false, delete: false, export: false },
          themes: { view: false, create: false, edit: false, delete: false, export: false },
          roles: { view: false, create: false, edit: false, delete: false, export: false }
        }
      }
    ];
    
    // Create some default users
    const defaultUsers = [
      {
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        isTemplate: false,
        permissions: roleTemplates[0].permissions
      },
      {
        email: 'manager@gmail.com',  
        password: 'manager123',
        role: 'manager',
        isTemplate: false,
        permissions: roleTemplates[1].permissions
      }
    ];
    
    console.log('🔄 Creating role templates...');
    for (const template of roleTemplates) {
      try {
        await Permission.findOneAndUpdate(
          { role: template.role, isTemplate: true },
          template,
          { upsert: true, new: true }
        );
        console.log(`✅ Created/Updated role template: ${template.role}`);
      } catch (error) {
        console.error(`❌ Error creating template ${template.role}:`, error);
      }
    }
    
    console.log('\n🔄 Creating default users...');
    for (const user of defaultUsers) {
      try {
        await Permission.findOneAndUpdate(
          { email: user.email, isTemplate: false },
          user,
          { upsert: true, new: true }
        );
        console.log(`✅ Created/Updated user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error);
      }
    }
    
    console.log('\n🎉 Database setup complete!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });