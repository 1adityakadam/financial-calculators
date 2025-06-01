import { supabase } from '../lib/supabase'

export const saveChatMessage = async (userId, message, role) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          user_id: userId,
          role: role,
          content: JSON.stringify(message)
        }
      ])

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error saving chat message:', error)
    throw error
  }
}

export const getUserMessages = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data.map(message => {
      const content = JSON.parse(message.content)
      return { ...message, content }
    })
  } catch (error) {
    console.error('Error fetching user messages:', error)
    throw error
  }
}

export const getCalculatorMessages = async (calculatorType) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', 'calculator')
      .order('created_at', { ascending: true })

    if (error) throw error
    
    return data.filter(message => {
      const content = JSON.parse(message.content)
      return content.calculator_type === calculatorType
    })
  } catch (error) {
    console.error('Error fetching calculator messages:', error)
    throw error
  }
}
