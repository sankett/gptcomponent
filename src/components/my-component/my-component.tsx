import { Component, h, State } from '@stencil/core';


@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  
  divElement!: HTMLDivElement;
  checkBox!: HTMLInputElement;
  @State() prompt: string= "List of 8 questions for my interview with a science fiction author:";
  @State() result: string= "";
  @State() loading: number= 0;
  
  loadInterval: any;

  handleChange(event) {
    this.prompt = event.target.value;
  }
  handleReset(event) {
    clearInterval(this.loadInterval)
    this.divElement.innerHTML = "";    
    this.checkBox.checked = false;
    this.prompt = "List of 8 questions for my interview with a science fiction author:"
  }
  handleClick(event) {
    
    this.loading = 1;
    this.loader()
    const payload ={
      label: 'Comparison',
      value: '14',
      model: "text-davinci-003",
      preprompt: ``,
      prompt: this.prompt,
      temperature: 0,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stream: false,
    }

   
    let url = "https://sanketgpt.onrender.com/short";

    fetch(url, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
       },
      body: JSON.stringify({userInput: payload})
    })
    .then(res => res.json())
    .then((parseResult)  => {
      clearInterval(this.loadInterval)
      this.loading = 2;
      this.result = parseResult.output.text.replace("\n\n","").replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
      this.divElement.innerHTML = this.checkBox.checked ? this.result :  "Response Received"    
      if(!this.checkBox.checked) {
        setTimeout(() => {
          this.divElement.innerHTML = "";
        }, 5000)
      }
     
      
    })
  }

  loader(){
    let textContent = "Hold on, this shouldn't take too long";
    this.divElement.innerHTML = textContent;
    this.loadInterval = setInterval(() => {
        
        textContent += '.';        
        if (textContent === "Hold on, this shouldn't take too long......") {
            textContent = "Hold on, this shouldn't take too long";
        }
        this.divElement.innerHTML = textContent;
       
    }, 300);
  }

  handleResult(event){    
    !this.checkBox.checked
  }

  render() {
    
    return [
      <div class="divMain">    
      <div>
        <textarea placeholder="Enter Prompt" value={this.prompt}
         onInput={(event) => this.handleChange(event)} 
         class="textarea"></textarea>
      </div>    
      <div>
        <span class="span50left check">
         <input type='checkbox' name="show" 
         ref={(el) => this.checkBox = el as HTMLInputElement}
         onClick={(e) => this.handleResult(e)}></input>
         <label htmlFor='show'> Show Result</label>
        </span>
        <span class="span50right">
          <input type="button" value="Go" class="button" onClick={(e) => this.handleClick(e)} />&nbsp;
          <input type="button" value="Reset" class="button" onClick={(e) => this.handleReset(e)}/>
        </span>
        
      </div>
       
        
       <div class="divResult fade-in-text" ref={(el) => this.divElement = el as HTMLDivElement}></div> 
        
        
        
        
      </div>
    ]
  }
}
