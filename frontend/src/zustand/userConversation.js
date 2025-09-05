// import { create } from 'zustand'

// const userConversation = create((set) => ({
//     selectedConversation: null,
//     setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

//     messages: [],
//     setMessages: (messages) => set({ messages }),
// }))

// export default userConversation;

import { create } from 'zustand'

const userConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) =>
        set({ selectedConversation }),

    messages: [],
    setMessages: (messages) => set({ messages }), // ✅ consistent with MessageContainer
}))

export default userConversation;

