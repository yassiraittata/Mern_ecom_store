import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState, useEffect } from "react";

const ProductsList = () => {
  const {
    deleteProduct,
    toggleFeaturedProduct,
    products,
    loading,
    fetchAllProducts,
    totalPages,
  } = useProductStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchAllProducts(page, limit);
  }, [fetchAllProducts, page, limit]);

  return (
    <motion.div
      className="overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {loading &&
        [...Array(6)].map((_, i) => (
          <div className="flex flex-row gap-2 min-w-full mt-5" key={i}>
            <div className="animate-pulse bg-gray-700 w-32 rounded-lg"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="animate-pulse bg-gray-700 w-10/12 h-8 rounded-lg"></div>
              <div className="animate-pulse bg-gray-700 w-full h-6 rounded-lg"></div>
              <div className="animate-pulse bg-gray-700 w-full h-4 rounded-lg"></div>
            </div>
          </div>
        ))}

      {!loading && (
        <>
          <table className="shadow-lg rounded-lg overflow-hidden min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Category
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Featured
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {products?.map((product) => (
                <tr key={product._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      ${product.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeaturedProduct(product._id)}
                      className={`p-1 rounded-full ${
                        product.isFeatured
                          ? "bg-yellow-400 text-gray-900"
                          : "bg-gray-600 text-gray-300"
                      } hover:bg-yellow-500 transition-colors duration-200`}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav
            aria-label="Page navigation example"
            className="flex items-center space-x-4 mt-5 justify-between mb-2"
          >
            <ul className="flex -space-x-px text-sm gap-2 items-center justify-center">
              {[...Array(totalPages)].map((_, i) => (
                <li>
                  <button
                    onClick={() => setPage(i + 1)}
                    className={`flex items-center justify-center text-body ${page === i + 1 ? "bg-emerald-400 text-heading text-white" : "bg-neutral-secondary-medium text-emerald-400"} border border-default-medium cursor-pointer rounded-full border-emerald-400 hover:bg-emerald-400 hover:text-heading hover:text-white shadow-xs font-medium leading-5 text-sm w-9 h-9 focus:outline-none`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>

            <select
              id="countries"
              className="block w-fit px-3 py-2.5 border border-gray-400 text-heading text-sm leading-4 rounded-lg text-gray-400"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option selected value="10">
                10 per page
              </option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </nav>
        </>
      )}
    </motion.div>
  );
};
export default ProductsList;
