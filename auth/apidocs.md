# Warranty Wizard

## `Auth`

Base-url: https://api-warranty.neoscoder.com || http://10.38.17.56:3003

### Registrations: shop registration api
   method: `POST`

   auth: `None`

   url: `Base-url/api/v1/auth/registerShop`
  
   `body: {formdata}`

```
    key: data
    value: {
              "strShopName": "BlueBloom",
              "strOwnerName": "Jane Doe",
              "strPhone": "+1234567800",
              "strPassword": "securepassword123",
              "intOrganizationId": 2
           }
```
```
    key: img 
    value: (Upload file from Local device) `http.MultipartFile.fromPath()` {dart format}
```    
       
### Login: retailer login api
   method: `POST`

   authorization: `None`

   url: `Base-url/api/v1/auth/login`
  
   `body:`
```
    {
         "strEmailOrPhone": "gourob@gmail.com",
         "strPassword" : "gourob123"
    }

```

### Reset password: reseting password after Forget Password and getting otp
   method: `POST`

   authorization: `None`

   url: `Base-url/api/v1/auth/password/reset`
  
   `body:`
```
    {
       "credential": "alifrahman363@gmail.com",
       "newPassword": "alif123" 
    }
```

### Send OTP: send otp for reseting password
   method: `POST`

   authorization: `None`

   url: `Base-url/api/v1/auth/password/reset/send-otp`
  
   `body:`
```
    {
        "credential": "alifrahman363@gmail.com"
    }
```

### Verify OTP: Verify otp which is alredy sent for reseting password
   method: `POST`

   authorization: `None`

   url: `Base-url/api/v1/auth/password/reset/verify-otp`
  
   `body:`
```
    {
      "credential": "01744677768",
      "otp": 621419 
    }
```

### Refresh RefreshToken: Generate new Refresh token
   method: `POST`

   authorization: `None`

   url: `Base-url/api/v1/auth/refresh`
  
   `body:`
```
   {
    "refresh" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjAxODMyODkwNDcwQGVtYWlsLmNvbSIsImludElkIjo2LCJwYXNzd29yZCI6IiQyYiQxMCRzeVgwdWhlcWg3Ump3Yks3emdETzhPNWlLVWxsa2xmU2h2WnN6Q1RuZ1d3dUxwQnpMMElqMiIsImlhdCI6MTcwOTQ0NTQ4MCwiZXhwIjoxNzEyMDM3NDgwfQ.bB_vx5gRdsy-mwrMVQXwGP3opempeBT-ztBskEZ8KQY"
   }
```

### Logout
   method: `POST`

   authorization: `None`

   url: `Base-url/api/v1/auth/logout`
  
   `body:`
```
{
    "credential" : "01832890470" || "cred@gmail.com"
}
```

---

## `Product`

### Product Register: product register for customer while selling
   method: `POST`

   authorization: `Bearer token`

   url: `Base-url/api/v1/product-reg/create-by-barcode`
  
   `body:`
```
    {
       "strBarCode": "EFGHIJ123456",
       "strPhone": "938594805845",
       "strCustomerName": "Alif"
    }
```


### Product details by barcode: get product details by barcode
   method: `GET`

   authorization: `None`

   url: `Base-url/api/v1/products/barcode/:barcode`
  
   `params:`
```
    key: barcode
    value: GHIJKL234567
```

### Product validation by barcode: check product validation by barcode
   method: `GET`

   authorization: `None`

   url: `Base-url/api/v1/products/validation/:barcode`
  
   `params:`
```
    key: barcode
    value: GHIJKL234567
```

### Sold Product List: Product registration created by retailer
   method: `GET`

   authorization: `Bearer Token`

   url: `Base-url/api/v1/product-reg/sold-products`


### Product replace by barcode: Replace product by barcode
   method: `PUT`

   authorization: `Bearer Token`

   url: `Base-url/api/v1/product-reg/replace-barcode`
  
   `body:`
```
   {
    "strOldBarCode" : "MNOPQR345678",
    "strNewBarCode" : "STUVWX123456"
   }
```