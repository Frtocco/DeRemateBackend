import z from 'zod'

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required.'
  }),
  email: z.string().email({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required.'
  }),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required.'
  })
})

export async function validateUser (input) {
  return userSchema.safeParse(input)
}

export async function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}
