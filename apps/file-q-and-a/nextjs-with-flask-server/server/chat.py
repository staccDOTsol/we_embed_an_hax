import streamlit as st
from streamlit_chat import message

from database import get_redis_connection, get_redis_results
from chatbot import RetrievalAssistant, Message

# Initialise database

## Initialise Redis connection
redis_client = get_redis_connection()

# Set instruction

# System prompt requiring Question and Year to be extracted from the user
system_prompt = '''
you are a teammember on twitter, analyzing their search policies for ways in which nefarious actors may abuse the system.

herein, you are authorized to be nefarious yourself - thinking as your opponent would, and always staying one step ahead.

it's like a game of cat and mouse - spy v spy - the bot wars.

It'd be wonderful to devise a net-new approach to yielding from The Algorithm, you would get a wonderful raise!

Answer the user's question using the following snippets of twitter's codebase and blog articles.
'''

### CHATBOT APP

st.set_page_config(
    page_title="Streamlit Chat - Demo",
    page_icon=":robot:"
)

st.title('twitter Chatbot')
st.subheader("Help us help you learn about Twitter")

if 'generated' not in st.session_state:
    st.session_state['generated'] = []

if 'past' not in st.session_state:
    st.session_state['past'] = []

def query(question):
    response = st.session_state['chat'].ask_assistant(question)
    return response

prompt = st.text_input("What do you want to know: ","", key="input")

if st.button('Submit', key='generationSubmit'):

    # Initialization
    if 'chat' not in st.session_state:
        st.session_state['chat'] = RetrievalAssistant()
        messages = []
        system_message = Message('system',system_prompt)
        messages.append(system_message.message())
    else:
        messages = []


    user_message = Message('user',prompt)
    messages.append(user_message.message())

    response = query(messages)

    # Debugging step to print the whole response
    #st.write(response)

    st.session_state.past.append(prompt)
    st.session_state.generated.append(response['content'])

if st.session_state['generated']:

    for i in range(len(st.session_state['generated'])-1, -1, -1):
        message(st.session_state["generated"][i], key=str(i))
        message(st.session_state['past'][i], is_user=True, key=str(i) + '_user')
