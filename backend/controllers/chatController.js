import ChatMessage from '../models/ChatMessage.js';
import Medicine from '../models/Medicine.js';

// @desc    Send message to AI Chatbot
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res) => {
  const { message } = req.body;

  try {
    // Save user message
    const userMessage = await ChatMessage.create({
      user: req.user._id,
      message,
      sender: 'user',
    });

    // Mock AI response logic
    let aiResponseText = '';
    const lowercaseMsg = message.toLowerCase();

    if (lowercaseMsg.includes('fever') || lowercaseMsg.includes('headache')) {
      const medicines = await Medicine.find({
        $or: [
          { symptoms: { $regex: 'fever', $options: 'i' } },
          { symptoms: { $regex: 'headache', $options: 'i' } }
        ]
      }).limit(2);
      
      aiResponseText = `I'm sorry to hear you're feeling unwell. For fever and headache, commonly used medicines include ${medicines.map(m => m.name).join(', ')}. Please rest and drink plenty of fluids. **Disclaimer: This is not medical advice. Please consult a qualified doctor.**`;
    } else if (lowercaseMsg.includes('cold') || lowercaseMsg.includes('cough')) {
        aiResponseText = "It sounds like you might have a cold. Staying hydrated and getting rest is important. You might consider medicines like Paracetamol or cough syrups, but please consult a doctor for a proper diagnosis.";
    } else {
      aiResponseText = "I'm here to help with your health queries. Could you tell me more about your symptoms? Remember, I am an AI assistant and not a replacement for a professional medical consultation.";
    }

    // Save AI message
    const aiMessage = await ChatMessage.create({
      user: req.user._id,
      message: aiResponseText,
      sender: 'ai',
    });

    res.json({
        userMessage,
        aiMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chat
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
