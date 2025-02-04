import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { Calculator, RefreshCw, DollarSign, Percent } from "lucide-react";

interface FormData {
    quantity: string;
    price: string;
    total: string;
    profit: string;
    isFromApi: boolean;
}

interface ApiResponse {
    quantity: number;
    price: number;
    total: number;
    profit: number;
    isFromApi: boolean;
}

function CalculationForm() {
    const [formData, setFormData] = useState<FormData>({
        quantity: "",
        price: "",
        total: "",
        profit: "",
        isFromApi: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchDataFromApi = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>(
                "http://localhost:3000/api/form-data"
            );
            setFormData({
                quantity: response.data.quantity.toString(),
                price: response.data.price.toString(),
                total: response.data.total.toString(),
                profit: response.data.profit.toString(),
                isFromApi: response.data.isFromApi,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotal = (quantity: number, price: number): number => {
        return quantity * price;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;

        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: value,
                isFromApi: false,
            };

            if (name === "quantity" || name === "price") {
                const quantity =
                    name === "quantity" ? numValue : parseFloat(prev.quantity) || 0;
                const price =
                    name === "price" ? numValue : parseFloat(prev.price) || 0;
                newData.total = calculateTotal(quantity, price).toString();
            }

            return newData;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-lg mx-auto">
                <div className="backdrop-blur-lg bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-center space-x-3 mb-8">
                            <Calculator className="w-8 h-8 text-blue-400" />
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Calculation Form
                            </h2>
                        </div>

                        <button
                            onClick={fetchDataFromApi}
                            disabled={isLoading}
                            className="w-full mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{isLoading ? 'Loading...' : 'Load Data from API'}</span>
                        </button>

                        <form className="space-y-6">
                            <div className="space-y-4">
                                {[
                                    { label: 'Quantity', name: 'quantity', icon: Calculator },
                                    { label: 'Price', name: 'price', icon: DollarSign },
                                    { label: 'Profit (%)', name: 'profit', icon: Percent },
                                ].map((field) => (
                                    <div key={field.name} className="relative group">
                                        <label className="text-gray-300 font-medium block mb-2 transition-colors group-hover:text-blue-400">
                                            {field.label}
                                        </label>
                                        <div className="relative">
                                            <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                            <input
                                                type="number"
                                                name={field.name}
                                                value={formData[field.name as keyof FormData]}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:bg-gray-700/70"
                                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="relative group">
                                    <label className="text-gray-300 font-medium block mb-2">
                                        Total
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            name="total"
                                            value={formData.total}
                                            readOnly
                                            className="w-full bg-gray-700/30 border border-gray-600 text-gray-400 rounded-xl px-10 py-3 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                    formData.isFromApi 
                                        ? 'bg-blue-500/20 text-blue-400' 
                                        : 'bg-purple-500/20 text-purple-400'
                                } transition-all duration-300`}>
                                    {formData.isFromApi ? "Values loaded from API" : "Values entered manually"}
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalculationForm;