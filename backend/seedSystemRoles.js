import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './models/Role.js';

dotenv.config();

// System roles with comprehensive permissions
const systemRoles = [
  {
    name: 'Super Admin',
    level: 4,
    permissions: [
      'manage_products',
      'manage_orders', 
      'manage_customers',
      'manage_categories',
      'manage_coupons',
      'manage_staff',
      'manage_settings',
      'view_reports',
      'manage_themes',
      'manage_blog'
    ],
    description: 'Complete system control with all permissions. Can manage other admins, system settings, and has access to all features.',
    isSystemRole: true
  },
  {
    name: 'Admin',
    level: 3,
    permissions: [
      'manage_products',
      'manage_orders',
      'manage_customers', 
      'manage_categories',
      'manage_coupons',
      'view_reports',
      'manage_blog'
    ],
    description: 'Full access to manage products, orders, customers, and content. Cannot modify system settings or other admins.',
    isSystemRole: true
  },
  {
    name: 'Editor',
    level: 2,
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_blog'
    ],
    description: 'Can create and edit content, manage blog posts, and update product information. Limited administrative access.',
    isSystemRole: true
  },
  {
    name: 'Viewer',
    level: 1,
    permissions: [
      'view_reports'
    ],
    description: 'Read-only access to view reports, analytics, and system information. Cannot make any changes.',
    isSystemRole: true
  }
];

// Seed system roles function
async function seedSystemRoles() {
  try {
    console.log('👥 Starting system roles seeding process...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Check existing roles
    const existingRoles = await Role.find({});
    const existingRoleNames = existingRoles.map(role => role.name.toLowerCase());
    
    console.log(`📋 Found ${existingRoles.length} existing roles:`, existingRoles.map(r => r.name));

    // Filter new roles (avoid duplicates)
    const newRoles = systemRoles.filter(role => 
      !existingRoleNames.includes(role.name.toLowerCase())
    );
    
    if (newRoles.length === 0) {
      console.log('✅ All system roles already exist in the database!');
    } else {
      // Insert new roles
      const insertedRoles = await Role.insertMany(newRoles);
      console.log(`🎉 Successfully added ${insertedRoles.length} new system roles:`);
      
      insertedRoles.forEach((role, index) => {
        console.log(`   ${index + 1}. 👥 ${role.name} (Level ${role.level})`);
        console.log(`      Description: ${role.description}`);
        console.log(`      Permissions: ${role.permissions.length} permissions`);
        console.log(`      Permissions: ${role.permissions.join(', ')}`);
        console.log('');
      });
    }

    // Display all roles summary
    const allRoles = await Role.find({}).sort({ level: -1 });
    console.log(`\n📊 Role Database Summary:`);
    console.log(`   Total Roles: ${allRoles.length}`);
    console.log(`   System Roles: ${allRoles.filter(r => r.isSystemRole).length}`);
    console.log(`   Custom Roles: ${allRoles.filter(r => !r.isSystemRole).length}`);
    console.log(`   Available Roles:`);
    
    allRoles.forEach((role, index) => {
      const type = role.isSystemRole ? '🔧 SYSTEM' : '🎨 CUSTOM';
      console.log(`     ${index + 1}. ${type} ${role.name} (Level ${role.level})`);
      console.log(`        ${role.description}`);
      console.log(`        Permissions: ${role.permissions.length} assigned`);
    });

    console.log('\n👥 System roles seeding completed successfully!');
    console.log('💡 You can now assign these roles to admin users.');
    console.log('🔒 Role hierarchy: Super Admin > Admin > Editor > Viewer');
    
  } catch (error) {
    console.error('❌ Error seeding system roles:', error);
    throw error;
  }
}

// Run the seeder
console.log('🚀 Bloom E-Commerce System Roles Seeder');
console.log('=======================================');

seedSystemRoles()
  .then(() => {
    console.log('\n✅ Seeding process completed!');
    console.log('👥 System roles are ready for assignment!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error);
    process.exit(1);
  });