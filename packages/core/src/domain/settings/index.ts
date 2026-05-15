import { z } from 'zod'

export const settingsProfileSchema = z.object({
  name: z.string().min(3, 'Nome profissional deve ter no mínimo 3 caracteres'),
  crefito: z
    .string()
    .min(1, 'Registro é obrigatório')
    .regex(/^\d{2}\/\d{5}$/, 'Formato inválido. Use 00/00000'),
})

export const settingsClinicSchema = z.object({
  clinicName: z
    .string()
    .min(3, 'Nome da clínica deve ter no mínimo 3 caracteres'),
  cnpj: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value),
      {
        message: 'Formato inválido. Use 00.000.000/0000-00',
      },
    ),
  cityState: z.string().min(3, 'Cidade/UF é obrigatório'),
  address: z.string().min(5, 'Endereço muito curto'),
})

export const settingsPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z
      .string()
      .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Nova senha deve conter uma letra maiúscula')
      .regex(/[0-9]/, 'Nova senha deve conter um número'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type SettingsProfileInput = z.infer<typeof settingsProfileSchema>
export type SettingsClinicInput = z.infer<typeof settingsClinicSchema>
export type SettingsPasswordInput = z.infer<typeof settingsPasswordSchema>

export type SettingsLocalClinicData = {
  crefito: string
  cnpj: string
  cityState: string
  address: string
}
