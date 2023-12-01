"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  thumbnail: string;
  description: string;
}

const saveToCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const getCartItems = (): Promise<CartItem[]> => {
  const cartData = localStorage.getItem("cart");

  return cartData ? JSON.parse(cartData) : [];
};
const updateCartMutation = async (newCart: CartItem[]) => {
  saveToCart(newCart);
  return newCart;
};
const removeFromCart = () => {};

export function useShop() {
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const { mutateAsync: updateCartMutationAsync } = useMutation({
    mutationFn: updateCartMutation,
    onSuccess: (newCart) => {
      //  TODO: update cart cacha

      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const addToCart = async (item: CartItem) => {
    const existingItem = cartItems?.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const newCartItems = (cartItems || [])?.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : { ...cartItem }
      );

      await updateCartMutationAsync(newCartItems);
    } else {
      const newCartItems = [...(cartItems || []), { ...item, quantity: 1 }];

      await updateCartMutationAsync(newCartItems);
    }
  };

  const removeFromCart = async (itemId: string) => {
    const newCartItems = (cartItems || []).filter((item) => item.id !== itemId);

    await updateCartMutationAsync(newCartItems);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const newCartItems = (cartItems || []).map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    await updateCartMutationAsync(newCartItems);
  };

  const getTotalPrice = () => {
    return cartItems?.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const clearCart = async () => {
    await updateCartMutationAsync([]);
  };

  return {
    cartItems,
    addToCart,
    getTotalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
