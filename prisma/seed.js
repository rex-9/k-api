import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {
  const provider = await prisma.providers.upsert({
    where: { provider_id: 1 },
    update: {},
    create: {
      provider_name: "Kunaung",
      provider_address: "Address of Provider",
      provider_phone: await bcrypt.hash('09293849383', 10),
      provider_email: "Email of Provider",
      provider_type: "BROKER",
      provider_logo: "svg",
      users: {
        create: [
          {
            user_email: "bryan@yu.com",
            user_phone: "+65216546546",
            user_password: await bcrypt.hash("password", 10),
            user_first_name: "Bryan",
            user_last_name: "Yu",
            user_dob: "1995-05-10T00:00:00.000Z",
            user_address: "Singapore",
          },
          {
            user_email: "rex@soul.com",
            user_phone: "+959443112251",
            user_password: await bcrypt.hash("password", 10),
            user_first_name: "Rex",
            user_last_name: "Soul",
            user_dob: "1995-05-10T00:00:00.000Z",
            user_address: "Myanmar",
          },
        ],
      },
    },
  })

  const category = await prisma.product_categories.upsert({
    where: {category_id: 1},
    update: {},
    create: {
      category_name: "Category 1",
      category_desc: "The Description of the Category 1"
    },
  });

  const product = await prisma.products.upsert({
    where: {product_id: 1},
    update: {},
    create: {
      product_name: "The Name of the Product 1",
      product_desc: "The Description of the Product 1",
      product_min_price: 10.05,
      product_max_price: 20.05,
      category_id: 1,
      provider_id: 1,
      fields_definition: {
        attribute: "The Definition of Fields"
      },
      formula_logic: {
        attribute: "The Logic of the Formula"
      },
      product_attachments: {
        create: [
          {
            attachment_url: "URL of the Product Attachment 1",
            attachment_filename: "Filename of the Product Attachment 1",
            attachment_mime_type: "Mime Type of Product Attachment 1",
            is_logo: true,
          },
          {
            attachment_url: "URL of the Product Attachment 2",
            attachment_filename: "Filename of the Product Attachment 2",
            attachment_mime_type: "Mime Type of Product Attachment 2",
            is_logo: false,
          }
        ]
      },
      vouchers: {
        create: {
          voucher_code: "123456",
          voucher_type: "Type of Voucher 1",
          voucher_amount: 20.05,
          valid_from: "2023-04-10T11:00:00Z",
          valid_until: "2024-04-10T11:00:00Z"
        }
      },
    },
  });

  const quotation = await prisma.quotations.upsert({
    where: {quotation_id: 1},
    update: {},
    create: {
      user_id: 1,
      provider_id: 1,
      product_id: 1,
      quotation_no: '123456',
      object_details: {
        attribute: "Details of the Object"
      },
      quotation_premium_amount: 29.04,
      quotation_discount_percent: 10,
      quotation_discount_amount: 29.66,
      quotation_comission_percent: 29.66,
      quotation_comission_amount: 29.66,
      quotation_wht_percent: 29.66,
      quotation_vat_percent: 29.66,
      quotation_additional_cover_amount: 29.66,
    },
  });

  const policy = await prisma.policies.upsert({
    where: {policy_id: 1},
    update: {},
    create: {
        user_id: 1,
        provider_id: 1,
        quotation_id: 1,
        product_id: 1,
        policy_no: '123456',
        policy_start_date: "2022-07-10T12:00:59Z",
        policy_end_date: "2025-07-10T12:00:59Z",
        policy_premium_amount: 29.04,
        policy_discount_percent: 10,
        policy_discount_amount: 29.66,
        policy_comission_percent: 29.66,
        policy_comission_amount: 29.66,
        policy_wht_percent: 29.66,
        policy_vat_percent: 29.66,
        policy_additional_cover_amount: 29.66,
        policy_terms: "Terms and conditions of the Policy 1",
        policy_coverage: "Coverage of the Policy 1",
        policy_deductible: 29.66,
        documents: {
          create: [
            {
              document_url: "The URL of the Document 1",
              document_filename: "Filename of the Document 1",
              document_mime_type: "Mime Type of Document 1"
            },
            {
              document_url: "The URL of the Document 2",
              document_filename: "Filename of the Document 2",
              document_mime_type: "Mime Type of Document 2"
            }
          ]
        },
        reviews: {
          create: [
            {
              user_id: 1,
              rating: 1,
              comment: "Comment of the Policy Review",
              attachments: {
                create: [
                  {
                    attachment_url: "URL of the Review Attachment 1",
                    attachment_filename: "Filename of the Review Attachment 1",
                    attachment_mime_type: "Mime Type of Review Attachment 1"
                  },
                  {
                    attachment_url: "URL of the Review Attachment 1",
                    attachment_filename: "Filename of the Review Attachment 1",
                    attachment_mime_type: "Mime Type of Review Attachment 1"
                  },
                ]
              }
            },
            {
              user_id: 2,
              rating: 5,
              comment: "Comment of the Policy Review"
            }
          ]
        },
        payments: {
          create: [{
            payment_amount: 20.05,
            payment_date: "2023-04-10T11:00:00Z",
            payment_gateway_name: "Name of the Gateway 1",
            payment_gateway_ref: "Reference to the Payment Gateway 1",
        }]
        },
        insured_objects: {
          create: {
            object_name: "Name of Object 1",
            object_value: 20.05,
            object_desc: "Description of Object 1",
            category_id: 1,
          }
        }
      },
  });

  const cart = await prisma.shopping_carts.upsert({
    where: { cart_id: 1 },
    update: {},
    create: {
      user_id: 1,
      product_id: 1,
      object_id: 1,
      quotation_id: 1,
      cart_quantity: 5
    }
  });

  const data = await prisma.external_data.upsert({
    where: { data_id: 1 },
    update: {},
    create: {
      data_name: "Name of Data",
      data_type: "Type of Data",
      data_value: {
          body: "Value of Data"
      }
    }
  });

  console.log({ provider, category, product, quotation, policy, cart, data })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })