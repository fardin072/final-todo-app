function RedText({ text }) {
  return <div style={{color: "red"}}>
    {text}
  </div>
}

function Text({ text, color, size }) {
  return <div style={{color: color, fontSize: size}}>
    {text}
  </div>
}

function Button({ children }) {
  function clickHandler() {
    alert("hello");
  }
  return <button onClick={clickHandler}>{ children }</button>
}

function Border({ children }) {
  return <div style={{ border: "1px solid black", padding: "20px" }}>{children}</div>
}

function Counter() {
    // you have to declare a state
    const [count, setCount] = useState(0);
    function increment() {
      setCount(count + 1);
    }
    return <div>
      <h1>{count}</h1>
      <button onClick={increment}>Press Here</button>
    </div>
  }
  
  function Form() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    function handleNameChange(e) {
      setName(e.target.value);
    }
  
    function handlePhoneChange(e) {
      setPhone(e.target.value);
    }
  
    function isValidPhoneNumber(phoneNumber) {
      if(phoneNumber.length != 11) return false;
      for(var i=0;i<phoneNumber.length;i++) {
        const c = phoneNumber[i];
        if(!('0' <= c && c <= '9')) return false;
      } 
      return true;
    }
    function showName() {
      if(name == "jaber") return <span style={{ color: "red" }}>{name}</span>
      else return <span>{name}</span>
    }
    return <div>
      <div>
        Name: <input type="text" onChange={handleNameChange} value={name} /> <br/> <br/>
        Phone: <input type="text" onChange={handlePhoneChange} value={phone} />
      </div>
      <div>
        {
          isValidPhoneNumber(phone) ? "Valid phone number" : "Invalid phone number" 
        }
      </div>
      {
        name.length > 0 && <div>
          You name is {showName()}
        </div>
      }
      {
        name.length > 0 ? <div>
          You name is {showName()}
        </div> : ""
      }
    </div>
  }

  function Test() {
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");
    function handleChange(e) {
      setText(e.target.value);
    }
    
    useEffect(() => {
      if(text.length > 10) setMessage("Name too big");
      else if(text.length < 4) setMessage("Name too short");
      else setMessage("Name is ok");
    }, [text])
  
    return <>
      <input type="text" value={text} onChange={handleChange} />
      <div>
        Text: {text}
      </div>
      <div>
        {
          text.len 
        }
      </div>
    </>
  }

  function MessageBox() {
    const [message, setMessage] = useState("Loading ...");
    async function initialize() {
      // fetch data
      const response = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/message");
      const jsonData = await response.json();
      console.log(jsonData);
      setMessage(jsonData.message);
    }
    useEffect(() => {
      initialize();
    }, [])
    return <>
      {message}
    </>
  }