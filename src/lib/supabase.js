import { createClient } from '@supabase/supabase-js'

// Gebruik environment variabelen of veilige configuratie
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vxmhzhinqkiyxrfzffew.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '' // Laat leeg in productie voor veiligheid

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials zijn niet volledig geconfigureerd')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Message service functies
export const messageService = {
  // Haal berichten op voor een specifieke map
  async getMessages(folder = 'inbox') {
    try {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      let query = supabase
        .from('messages_x7k9y2m4n8')
        .select(`
          *,
          sender:sender_id(id,email,full_name),
          recipient:recipient_id(id,email,full_name)
        `)
        .order('created_at', {ascending: false})

      if (folder === 'sent') {
        query = query.eq('sender_id', user.id)
      } else if (folder === 'inbox') {
        query = query.eq('recipient_id', user.id).neq('folder', 'trash')
      } else if (folder === 'trash') {
        query = query.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`).eq('folder', 'trash')
      }

      const {data, error} = await query
      if (error) throw error

      // Transform data voor frontend gebruik
      return data.map(message => ({
        id: message.id,
        sender: message.sender?.full_name || message.sender?.email?.split('@')[0] || 'Onbekend',
        senderEmail: message.sender?.email || '',
        recipient: message.recipient?.full_name || message.recipient?.email?.split('@')[0] || 'Onbekend',
        recipientEmail: message.recipient?.email || '',
        subject: message.subject,
        content: message.content,
        date: new Date(message.created_at),
        read: message.read,
        folder: folder
      }))
    } catch (error) {
      console.error('Fout bij ophalen berichten:', error)
      throw error
    }
  },

  // Verstuur een nieuw bericht
  async sendMessage({recipientEmail, subject, content}) {
    try {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      // Zoek ontvanger op basis van email
      const {data: recipientData, error: recipientError} = await supabase
        .from('profiles_x7k9y2m4n8')
        .select('id')
        .eq('email', recipientEmail)
        .single()

      if (recipientError || !recipientData) {
        throw new Error('Ontvanger niet gevonden')
      }

      // Verstuur bericht naar ontvanger (inbox)
      const {data: inboxMessage, error: inboxError} = await supabase
        .from('messages_x7k9y2m4n8')
        .insert({
          sender_id: user.id,
          recipient_id: recipientData.id,
          subject,
          content,
          folder: 'inbox'
        })
        .select()
        .single()

      if (inboxError) throw inboxError

      // Maak kopie voor verzender (sent)
      const {data: sentMessage, error: sentError} = await supabase
        .from('messages_x7k9y2m4n8')
        .insert({
          sender_id: user.id,
          recipient_id: recipientData.id,
          subject,
          content,
          folder: 'sent',
          read: true // Verzonden berichten zijn altijd gelezen
        })
        .select()
        .single()

      if (sentError) throw sentError

      return {inboxMessage, sentMessage}
    } catch (error) {
      console.error('Fout bij versturen bericht:', error)
      throw error
    }
  },

  // Markeer bericht als gelezen
  async markAsRead(messageId) {
    try {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      const {data, error} = await supabase
        .from('messages_x7k9y2m4n8')
        .update({read: true})
        .eq('id', messageId)
        .eq('recipient_id', user.id)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Fout bij markeren als gelezen:', error)
      throw error
    }
  },

  // Verplaats bericht naar prullenbak
  async moveToTrash(messageId) {
    try {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      const {data, error} = await supabase
        .from('messages_x7k9y2m4n8')
        .update({folder: 'trash'})
        .eq('id', messageId)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Fout bij verplaatsen naar prullenbak:', error)
      throw error
    }
  },

  // Haal alle gebruikers op (voor autocomplete)
  async getUsers() {
    try {
      const {data, error} = await supabase
        .from('profiles_x7k9y2m4n8')
        .select('id,email,full_name,user_type')
        .order('full_name')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Fout bij ophalen gebruikers:', error)
      throw error
    }
  },

  // Haal aantal ongelezen berichten op
  async getUnreadCount() {
    try {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) return 0

      const {count, error} = await supabase
        .from('messages_x7k9y2m4n8')
        .select('*', {count: 'exact', head: true})
        .eq('recipient_id', user.id)
        .eq('read', false)
        .neq('folder', 'trash')

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Fout bij ophalen ongelezen berichten:', error)
      return 0
    }
  }
}

// Profile service functies
export const profileService = {
  // Maak of update gebruikersprofiel
  async upsertProfile(profileData) {
    try {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      const {data, error} = await supabase
        .from('profiles_x7k9y2m4n8')
        .upsert({
          id: user.id,
          email: user.email,
          ...profileData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Fout bij bijwerken profiel:', error)
      throw error
    }
  },

  // Haal gebruikersprofiel op
  async getProfile() {
    try {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      const {data, error} = await supabase
        .from('profiles_x7k9y2m4n8')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Fout bij ophalen profiel:', error)
      throw error
    }
  }
}