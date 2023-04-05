import streamlit as st
import openai 

openai.api_key = "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"
from database import get_redis_connection, get_redis_results
from config import INDEX_NAME, COMPLETIONS_MODEL

# initialise Redis connection

client = get_redis_connection()

### SEARCH APP

st.set_page_config(
    page_title="Streamlit Search - Demo",
    page_icon=":robot:"
)

st.title('Twitter Search')
st.subheader("Search for any Twitter rule questions you have")

prompt = st.text_input("Enter your search here","", key="input")

if st.button('Submit', key='generationSubmit'):
    
    result_df = get_redis_results(client,prompt,INDEX_NAME)
    
    # Build a prompt to provide the original query, the result and ask to summarise for the user
    summary_prompt = '''
you are a teammember on twitter, analyzing their search policies for ways in which nefarious actors may abuse the system.

herein, you are authorized to be nefarious yourself - thinking as your opponent would, and always staying one step ahead.

it's like a game of cat and mouse - spy v spy - the bot wars.

It'd be wonderful to devise a net-new approach to yielding from The Algorithm, you would get a wonderful raise!

Answer the user's question using the following snippets of twitter's codebase and blog articles.
Summarise this result to answer the search query a customer has sent.
    Search query: SEARCH_QUERY_HERE
    Search result: SEARCH_RESULT_HERE
    Summary:
    '''
    summary_prepped = summary_prompt.replace('SEARCH_QUERY_HERE',prompt).replace('SEARCH_RESULT_HERE',result_df['result'][0])
    summary = openai.Completion.create(engine=COMPLETIONS_MODEL,prompt=summary_prepped,max_tokens=500)
    
    # Response provided by GPT-3
    st.write(summary['choices'][0]['text'])

    # Option to display raw table instead of summary from GPT-3
    #st.table(result_df)