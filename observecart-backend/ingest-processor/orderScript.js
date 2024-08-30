const { chromium } = require('playwright');

async function placeOrder(baseUrl) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the homepage
    await page.goto(baseUrl);


    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME);
    await page.getByPlaceholder('Username').press('Tab');
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.locator('.product-item:first-child > button').first().click();
    await page.locator('.product-item:nth-child(2) > button').click();
    await page.locator('.product-item:nth-child(3) > button').click();
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await page.getByRole('button', { name: 'Place Order' }).click();
    await page.waitForSelector('text=Order Confirmed');
    await page.getByText('Continue Shopping').click();

    // // Login (adjust selectors based on your actual login form)
    // await page.click('text=Login');
    // await page.fill('input[name="username"]', process.env.TEST_USERNAME);
    // await page.fill('input[name="password"]', process.env.TEST_PASSWORD);
    // await page.click('button:has-text("Sign in")');

    // // Wait for login to complete
    // await page.waitForNavigation();

    // // Add a product to cart (adjust selector based on your product list)
    // await page.click('.product-item:first-child button:has-text("Add to Cart")');

    // // Navigate to cart
    // await page.click('text=Cart');

    // // Proceed to checkout
    // await page.click('text=Proceed to Checkout');

    // // Place order (adjust based on your checkout process)
    // await page.click('button:has-text("Place Order")');

    // // Wait for order confirmation
    // await page.waitForSelector('text=Order Confirmed');

    console.log('Order placed successfully');
  } catch (error) {
    console.error('Error placing order:', error);
  } finally {
    await browser.close();
  }
}

module.exports = placeOrder;