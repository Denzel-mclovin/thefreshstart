import { LeadService } from '../../services/lead.service'

export default defineEventHandler(async () => {
  const leads = await LeadService.getFreeLeads()

  return {
    leads,
  }
})