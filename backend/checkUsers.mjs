import mongoose from 'mongoose';
import Permission from './models/Permission.js';

mongoose.connect('mongodb://localhost:27017/dashtar')
  .then(async () => {
    console.log('📦 Connected to database');
    
    // Check role templates
    const roleTemplates = await Permission.find({isTemplate: true});
    console.log('\n📋 Role Templates in database:');
    roleTemplates.forEach((template, index) => {
      console.log(`${index + 1}. Role: ${template.role} (Template)`);
    });
    
    // Check users
    const users = await Permission.find({isTemplate: false});
    console.log('\n👥 Users in database:');
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Has Permissions: ${user.permissions ? 'Yes' : 'No'}`);
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
    }
    
    if (roleTemplates.length === 0) {
      console.log('❌ No role templates found in database!');
    }
    
    process.exit();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });