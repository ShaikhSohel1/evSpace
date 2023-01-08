const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) =>{
    const {items, email} = req.body;
    console.log(items)
    // console.log(email)

    const transformedItems = items.map(items => ({
        quantity: 1,
        price_data:{
            currency: 'INR',
            unit_amount: items.prize * 100,
            product_data:{
                name: items.name,
            },
        },
    }));


  //   const transformedItems = items.map(items => ({
  //         currency: 'INR',
  //         unit_amount: 9000,
  //         product_data:{
  //             name:items.id,
  //             end:items.end_time
  //         },
  // }));

    console.log(transformedItems)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: transformedItems,
        mode:'payment',
        success_url: 'http://localhost:3000/',
        cancel_url: 'http://localhost:3000/index',
        metadata: {
            email,
        },
    });


    res.status(200).json({id: session.id,
        status: session.status
        })
};



