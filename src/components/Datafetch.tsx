"use client";
import React, { useEffect, useState } from "react";
import { client } from "../../sanity-migration/sanityClient";
import { motion } from "framer-motion";

const Datafetch = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Track the clicked product

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
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product: any) => (
            <motion.div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              onClick={() => setSelectedProductId(product._id)} // Set the selected product on click
            >
              <motion.img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full object-cover"
                // Apply animation only to the selected image
                animate={{
                  scale: selectedProductId === product._id ? 1.1 : 1, // Scale up on click
                  rotate: selectedProductId === product._id ? 10 : 0, // Rotate a little on click
                }}
                transition={{ duration: 0.3 }}
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
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Datafetch;
