'use strict';

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    
    try {
      const order = await strapi.entityService.findOne(
        'api::order.order',
        result.id,
        { populate: { user: { fields: ['email', 'username'] } } }
      );
      
      const user = {
        email: order?.user?.email,
        username: order?.user?.username,
      };
      
      if (!user.email) return;
      
      await strapi.plugins.email.services.email.send({
        to: user.email,
        from: 'danish4@wattmonk.com',
        replyTo: 'danish786.asp@gmail.com',
        subject: `Order #${order.id} Confirmed`,
        text: `Order #${order.id} has been placed successfully.\n\nOrder ID: ${order.id}\nPrice: ₹${order.totalAmount || 'N/A'}\nStatus: ${order.status}\n\nThank you for your purchase!`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333; margin: 0;">Order Confirmed!</h1>
            <p style="color: #666; margin-top: 5px;">Thank you for your purchase</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-top: 0; font-size: 18px;">Hello ${user.username},</h2>
            <p style="color: #555; line-height: 1.6;">Your order has been successfully placed. Here are your order details:</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-top: 0;">Order Details</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #333; width: 120px; display: inline-block;">Order ID:</span>
                <span style="color: #4CAF50;">#${order.id}</span>
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #333; width: 120px; display: inline-block;">Total Price:</span>
                <span style="color: #e74c3c; font-weight: bold;">₹${order.totalAmount || 'N/A'}</span>
              </li>
              <li style="padding: 10px 0;">
                <span style="font-weight: bold; color: #333; width: 120px; display: inline-block;">Status:</span>
                <span style="background: #4CAF50; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">${order.status}</span>
              </li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #777; font-size: 14px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0;">If you have any questions, contact us at <a href="mailto:danish786.asp@gmail.com" style="color: #3498db;">danish786.asp@gmail.com</a></p>
            <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} Ecommerce Platform. All rights reserved.</p>
          </div>
        </div>
        `
      });
      
    } catch (error) {
      console.error('Order email failed:', error.message);
    }
  }
};