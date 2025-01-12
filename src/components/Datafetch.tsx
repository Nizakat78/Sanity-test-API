"use client"
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  tags?: string[];
  imageUrl: string;
}

const Datafetch = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch data from Sanity
    const fetchData = async () => {
      const query = await client.fetch(
        `*[_type == "product"]{
          _id,
          name,
          price,
          discountPercentage,
          tags,
          "imageUrl": image.asset->url
        }`
      );
      setProducts(query);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-2">Price: ${product.price}</p>
                {product.discountPercentage && (
                  <p className="text-green-500 mb-2">
                    Discount: {product.discountPercentage}%
                  </p>
                )}
                {product.tags && (
                  <p className="text-sm text-gray-500">
                    Tags: {product.tags.join(", ")}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Datafetch;
