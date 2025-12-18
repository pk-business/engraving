import type { ShippingAddress, Order, CartItem, PaymentMethod } from '../types/cart.types';

class CheckoutService {
  /**
   * Process an order
   */
  async processOrder(
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    total: number
  ): Promise<Order> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const order: Order = {
          id: `ORD-${Date.now()}`,
          items,
          shippingAddress,
          paymentMethod,
          total,
          status: 'pending',
          createdAt: new Date(),
        };
        resolve(order);
      }, 1000);
    });
  }

  /**
   * Validate shipping address
   */
  validateAddress(address: ShippingAddress): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.fullName.trim()) errors.push('Full name is required');
    if (!address.addressLine1.trim()) errors.push('Address is required');
    if (!address.city.trim()) errors.push('City is required');
    if (!address.state.trim()) errors.push('State is required');
    if (!address.zipCode.trim()) errors.push('ZIP code is required');
    if (!address.phone.trim()) errors.push('Phone number is required');

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new CheckoutService();
