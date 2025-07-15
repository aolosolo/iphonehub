
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  specs: {
    storage: string;
    color: string;
    display: string;
  };
  features: string[];
  stock: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentDetails: {
      cardNumber: string;
      expiry: string;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};
