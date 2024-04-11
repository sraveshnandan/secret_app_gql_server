export const typeDefs = `#graphql
scalar Boolean
scalar UnSignedInt
scalar DateTime
scalar Number

# System Status Type
type SytemUser {
  uid:Int,
  gid:Int
  username:String
  homedir:String
  shell:String
}
type NetWork {
  address:String
  netmask:String
  family:String
  mac:String
  internal:Boolean
  cidr:Int
}
type Status {
  os: String,
  arch: String,
  platform: String,
  release: String,
  machine: String,
  memory: UnSignedInt,
  uptime: UnSignedInt,
  user:SytemUser
  network:NetWork
}

#User Type 

type Avatar {
  public_id:String,
  url:String
}
type User {
  _id:String!,
  name:String,
  email:String,
  phone_no:Number,
  avatar:Avatar,
  isShopOwner:Boolean,
  isAdmin:Boolean,
  shops:[Shop]
  createdAt:DateTime,
  updatedAt:DateTime

}

#Shop type 
type Shop {
  _id:String!
  name:String,
  description:String,
  images:[Avatar],
  products:[Product],
  owner:User,
  followers:[User],
  location:location,
  views:Int,
  address:String
  createdAt:DateTime,
  updatedAt:DateTime
}

type location{
  lat:Int,
  long:Int
}

#Product type 
type Product {
  _id:String!
  title:String,
  description:String,
  images:[Avatar],
  category:[Category],
  original_price:Int,
  discount_price:Int,
  ratings:Int,
  reviews:[Review],
  extra:[Extra],
  owner:Shop,
  likes:[User],
  views:Int,
  createdAt:DateTime,
  updatedAt:DateTime
}

#Category Type

type Category{
  _id:String!
  name:String,
  createdBy:User
  createdAt:DateTime,
  updatedAt:DateTime
}

#Review Type
 type Review {
  _id:String!
  user:User,
  star:Int,
  message:String,
  createdAt:DateTime,
  updatedAtL:DateTime
 }

 # Extra Type 
 type Extra {
  name:String,
  value:String
 } 



#Input Type 


input ShopInput {
  id:ID
  name:String,
  description:String,
  address:String,
  images:[AvatarInput]
}


input UserInput {
  name:String,
  email:String!,
  password:String
  avatar:AvatarInput,
  phone_no:String
}

input PasswordInput {
  oldPassword:String,
  newPassword:String
}

input AvatarInput {
  public_id:String
  url:String
}

input ProfileUpdateInput {
  name:String,
  email:String,
  phone_no:String,
  avatar:AvatarInput,
}
  input ExtraInput{
    name:String,
    value:String
  }

  input ProductInput {
    id:ID,
    title:String,
    description:String,
    images:[AvatarInput],
    category:[String],
    original_price:Int,
    discount_price:Int,
    extra:[ExtraInput],
    owner:String
  }

 #Responce Type 
  type UserResponce {
    message:String!,
    user:User!,
    token:String
  }

  type ShopResponce {
    message:String,
    data:Shop
  }

  type ProductResponce {
    message:String,
    data:Product
  }


type Query {
  status(secret:String):Status
  #user query 
  login(data:UserInput): UserResponce
  profile:UserResponce
  users:[User]
  #category query
  category:[Category]
  #Shop Query
  shops:[Shop]
  #Product Query
  products:[Product]
  sendOtp(email:String):Int
}

type Mutation {
  # User Mutations
  createUser(data:UserInput):UserResponce
  updatePassword(data:PasswordInput):String
  updateProfile(data:ProfileUpdateInput):String
  #Category Mutations
  createCategory(name:String!):String,
  updateCategory(id:ID!,name:String!):String
  deleteCategory(id:ID!):String
  # Shop Mutations
  createShop(data:ShopInput):Shop
  updateShop(data:ShopInput):ShopResponce
  deleteShop(id:ID!):String
  followShop(shopId:ID!):String
  #Product Mutations
  createProduct(data:ProductInput):ProductResponce
  updateProduct(data:ProductInput):ProductResponce
  likeProduct(productId:ID!):String
  deleteProduct(productId:ID!):String
}

`;
