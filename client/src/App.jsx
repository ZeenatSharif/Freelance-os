import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("freelanceos_user");
    return s? JSON.parse(s) : null;
  });
  const [loginForm, setLoginForm] = useState({ name: "", email: "" });
  const [tab, setTab] = useState("Dashboard");
  const [invoiceFilter, setInvoiceFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [trackedProject, setTrackedProject] = useState("");

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const greeting = new Date().getHours() < 12? "Good morning" : new Date().getHours() < 18? "Good afternoon" : "Good evening";

  useEffect(() => {
    let interval;
    if(isTracking){ interval = setInterval(()=> setSeconds(s => s+1), 1000); }
    return () => clearInterval(interval);
  }, [isTracking]);

  const [projects, setProjects] = useState(() => {
    const s = localStorage.getItem("freelanceos_projects");
    return s? JSON.parse(s) : [
      { id:1, name:"Arkio Brand Identity", client:"Arkio Labs", amount:6000, due:"2026-10-14", progress:72, status:"active" },
      { id:2, name:"Vesper iOS App", client:"Vesper Inc.", amount:12000, due:"2026-10-22", progress:38, status:"active" },
      { id:3, name:"Nimbus Dashboard", client:"Nimbus Co", amount:8500, due:"2026-10-28", progress:55, status:"active" },
    ];
  });
  const [invoices, setInvoices] = useState(() => {
    const s = localStorage.getItem("freelanceos_invoices");
    return s? JSON.parse(s) : [
      { id:1, client:"Arkio Labs", amount:6000, status:"pending", date:"2026-09-20", items:"Brand Identity Design" },
      { id:2, client:"Vesper Inc.", amount:4000, status:"overdue", date:"2026-09-10", items:"iOS App - Milestone 1" },
      { id:3, client:"Nimbus Co", amount:2150, status:"paid", date:"2026-08-15", items:"Dashboard UI" },
    ];
  });

  useEffect(()=>{ localStorage.setItem("freelanceos_projects", JSON.stringify(projects)) }, [projects]);
  useEffect(()=>{ localStorage.setItem("freelanceos_invoices", JSON.stringify(invoices)) }, [invoices]);

  const handleLogin = () => {
    if(!loginForm.email) return alert("Please enter email");
    const u = { name: loginForm.name || "User", email: loginForm.email, letter: (loginForm.name || loginForm.email)[0].toUpperCase() };
    setUser(u);
    localStorage.setItem("freelanceos_user", JSON.stringify(u));
  };
  const handleLogout = () => { localStorage.removeItem("freelanceos_user"); setUser(null); };

  const generatePDF = (inv) => {
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Invoice #${inv.id}</title><style>body{font-family:sans-serif;padding:40px}.header{display:flex;justify-content:space-between}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ddd;padding:10px}</style></head><body><div class="header"><div><h2>FreelanceOS</h2><p>Invoice #${inv.id}</p></div><div><p><b>From:</b> ${user.name} (${user.email})</p><p><b>To:</b> ${inv.client}</p><p><b>Date:</b> ${inv.date}</p></div></div><table><tr><th>Description</th><th>Amount</th></tr><tr><td>${inv.items}</td><td>$${inv.amount}</td></tr></table><h2>Total: $${inv.amount} - ${inv.status.toUpperCase()}</h2><script>window.print()</script></body></html>`);
    win.document.close();
  };

  const [form, setForm] = useState({ name:"", client:"", amount:"" });
  const addProject = () => {
    if(!form.name ||!form.client) return alert("Please enter project name and client");
    setProjects([...projects, { id:Date.now(), name:form.name, client:form.client, amount:parseInt(form.amount)||0, due:new Date().toISOString().split('T')[0], progress:10, status:"active" }]);
    setInvoices([...invoices, { id:Date.now(), client:form.client, amount:parseInt(form.amount)||0, status:"pending", date:new Date().toISOString().split('T')[0], items:form.name }]);
    setForm({ name:"", client:"", amount:"" });
  };

  // === YEH 4 BOXES AB 100% WORKING HAIN ===
  const filteredInvoices = invoiceFilter==="all"? invoices : invoices.filter(i=>i.status===invoiceFilter);
  const totalEarned = invoices.filter(i=>i.status==="paid").reduce((a,b)=>a+b.amount,0);
  const invoicesDue = invoices.filter(i=>i.status!=="paid").reduce((a,b)=>a+b.amount,0);
  const avgDailyRate = invoices.length > 0? Math.round((totalEarned + invoicesDue) / Math.max(projects.length, 1)) : 520;
  const hourlyRate = 65;
  const earnedNow = ((seconds/3600) * hourlyRate).toFixed(2);

  const updateProgress = (id, newProgress) => {
    setProjects(projects.map(p => p.id===id? {...p, progress: parseInt(newProgress)} : p));
  };

  if(!user){
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FDF5ED', fontFamily:'Outfit, sans-serif' }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" />
        <div style={{ background:'white', padding:'40px', borderRadius:'16px', border:'1px solid #EAE0D5', width:'360px', textAlign:'center' }}>
          <h2 style={{ margin:0 }}>Freelance<span style={{ color:'#E85D2A' }}>OS</span></h2>
          <p style={{ color:'#888', fontSize:'13px', marginTop:'8px' }}>Sign in to your workspace</p>
          <input value={loginForm.name} onChange={e=>setLoginForm({...loginForm, name:e.target.value})} placeholder="Your Name" style={{ width:'100%', padding:'12px', marginTop:'24px', borderRadius:'8px', border:'1px solid #ddd' }} />
          <input value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email:e.target.value})} placeholder="Email Address" style={{ width:'100%', padding:'12px', marginTop:'10px', borderRadius:'8px', border:'1px solid #ddd' }} />
          <button onClick={handleLogin} style={{ width:'100%', padding:'12px', background:'#121214', color:'white', border:'none', borderRadius:'8px', marginTop:'16px', cursor:'pointer', fontWeight:600 }}>Continue to Workspace →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'Outfit, sans-serif', background:'#FDF5ED' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" />
      <div style={{ width:'240px', background:'#121214', color:'white', padding:'20px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div>
          <div style={{ marginBottom:'40px' }}><h2 style={{ margin:0, fontSize:'18px' }}>Freelance<span style={{ color:'#E85D2A' }}>OS</span></h2><p style={{ fontSize:'10px', color:'#888', fontFamily:'DM Mono' }}>V2.4 · WORKSPACE</p></div>
          {[
            { label:'Dashboard' }, { label:'Projects' }, { label:'Invoices', badge: invoices.filter(i=>i.status!=='paid').length }, { label:'Clients' }, { label:'Time' }
          ].map(item=>(
            <div key={item.label} onClick={()=>setTab(item.label)} style={{ padding:'10px 12px', borderRadius:'8px', marginBottom:'6px', background: tab===item.label?'white':'transparent', color: tab===item.label?'black':'#888', cursor:'pointer', display:'flex', justifyContent:'space-between', fontSize:'14px', fontWeight: tab===item.label?600:400 }}>
              <span>{item.label}</span>
              {item.badge>0 && <span style={{ background:'#E85D2A', color:'white', borderRadius:'50%', width:'18px', height:'18px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px' }}>{item.badge}</span>}
            </div>
          ))}
          <div style={{ background:'#1E1E20', padding:'12px', borderRadius:'8px', marginTop:'20px' }}>
            <p style={{ fontSize:'12px', margin:0 }}>New Project</p>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Project name" style={{ width:'100%', padding:'6px', marginTop:'6px', borderRadius:'6px', border:'none', fontSize:'11px' }} />
            <input value={form.client} onChange={e=>setForm({...form, client:e.target.value})} placeholder="Client" style={{ width:'100%', padding:'6px', marginTop:'6px', borderRadius:'6px', border:'none', fontSize:'11px' }} />
            <input value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} placeholder="$ Amount" style={{ width:'100%', padding:'6px', marginTop:'6px', borderRadius:'6px', border:'none', fontSize:'11px' }} />
            <button onClick={addProject} style={{ width:'100%', padding:'8px', background:'#E85D2A', color:'white', border:'none', borderRadius:'6px', marginTop:'8px', cursor:'pointer', fontSize:'12px' }}>+ Add Project</button>
          </div>
        </div>
        <div onClick={handleLogout} style={{ display:'flex', gap:'10px', borderTop:'1px solid #222', paddingTop:'16px', alignItems:'center', cursor:'pointer' }}>
          <div style={{ width:'32px', height:'32px', background:'#E85D2A', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{user.letter}</div>
          <div><div style={{ fontSize:'13px', fontWeight:600 }}>{user.name}</div><div style={{ fontSize:'10px', color:'#888' }}>{user.email}</div></div>
        </div>
      </div>

      <div style={{ flex:1, padding:'30px 36px', overflowY:'auto' }}>
        {tab==="Dashboard" && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'30px' }}>
              <div>
                <h1 style={{ margin:0, fontSize:'22px', lineHeight:'1.2' }}>{greeting}, {user.name}</h1>
                <p style={{ fontSize:'12px', color:'#888', fontFamily:'DM Mono', marginTop:'6px' }}>{todayDate}</p>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', border:'1px solid #EAE0D5', background:'#FFFDF9', marginBottom:'24px' }}>
              <div style={{ padding:'20px', borderRight:'1px solid #EAE0D5', borderBottom:'1px solid #EAE0D5' }}><div style={{ fontSize:'10px', color:'#999', fontFamily:'DM Mono' }}>TOTAL EARNED</div><div style={{ fontSize:'32px', fontWeight:700 }}>${totalEarned.toLocaleString()}</div></div>
              <div style={{ padding:'20px', borderBottom:'1px solid #EAE0D5' }}><div style={{ fontSize:'10px', color:'#999', fontFamily:'DM Mono' }}>ACTIVE PROJECTS</div><div style={{ fontSize:'32px', fontWeight:700 }}>{projects.length}</div></div>
              <div style={{ padding:'20px', borderRight:'1px solid #EAE0D5' }}><div style={{ fontSize:'10px', color:'#999', fontFamily:'DM Mono' }}>INVOICES DUE</div><div style={{ fontSize:'32px', fontWeight:700 }}>${invoicesDue.toLocaleString()}</div></div>
              <div style={{ padding:'20px' }}><div style={{ fontSize:'10px', color:'#999', fontFamily:'DM Mono' }}>AVG. PROJECT VALUE</div><div style={{ fontSize:'32px', fontWeight:700 }}>${avgDailyRate.toLocaleString()}</div></div>
            </div>
            <div style={{ background:'#FFFDF9', border:'1px solid #EAE0D5' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #EAE0D5', fontWeight:600, fontSize:'13px' }}>Active Projects</div>
              {projects.map(p=>(
                <div key={p.id} style={{ padding:'18px 20px', borderBottom:'1px solid #F0E6D9', display:'flex', justifyContent:'space-between' }}>
                  <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:'14px' }}>{p.name}</div><div style={{ fontSize:'11px', color:'#999', fontFamily:'DM Mono' }}>{p.client}</div><div style={{ marginTop:'10px', height:'4px', background:'#F0E6D9', width:'90%' }}><div style={{ width:`${p.progress}%`, height:'100%', background: p.progress>70?'#E85D2A':'#121212' }}></div></div></div>
                  <div style={{ textAlign:'right' }}><div style={{ fontFamily:'DM Mono', fontWeight:600, fontSize:'13px' }}>${p.amount.toLocaleString()}</div><div style={{ fontSize:'10px', color:'#999', fontFamily:'DM Mono' }}>{p.progress}%</div></div>
                </div>
              ))}
            </div>
          </>
        )}
        {tab==="Projects" &&
          <div>
            <h2>Projects - {projects.length}</h2>
            <p style={{ fontSize:'12px', color:'#888', fontFamily:'DM Mono' }}>Update progress to see changes on Dashboard poll lines</p>
            <div style={{ background:'#FFFDF9', border:'1px solid #EAE0D5', marginTop:'16px' }}>
              {projects.map(p=>
                <div key={p.id} style={{ padding:'16px', borderBottom:'1px solid #eee' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ fontWeight:600 }}>{p.name} - {p.client}</span>
                    <span>{p.progress}% | ${p.amount}</span>
                  </div>
                  <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <input type="range" min="0" max="100" value={p.progress} onChange={(e)=> updateProgress(p.id, e.target.value)} style={{ flex:1 }} />
                    <button onClick={()=>setProjects(projects.filter(x=>x.id!==p.id))} style={{ background:'#ff4444', color:'white', border:'none', borderRadius:'4px', padding:'4px 8px', fontSize:'11px' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        {tab==="Invoices" && (
          <div>
            <h2 style={{ margin:0 }}>Invoices</h2>
            <p style={{ fontSize:'12px', color:'#888', fontFamily:'DM Mono', marginTop:'4px' }}>Manage and download client invoices</p>
            <div style={{ display:'flex', gap:'8px', margin:'16px 0' }}>
              {['all','pending','overdue','paid'].map(f=> (
                <button key={f} onClick={()=>setInvoiceFilter(f)} style={{ padding:'6px 14px', borderRadius:'20px', border:'1px solid #ddd', background: invoiceFilter===f?'#121214':'white', color: invoiceFilter===f?'white':'#333', textTransform:'capitalize', cursor:'pointer', fontSize:'12px' }}>{f} ({f==='all'?invoices.length:invoices.filter(i=>i.status===f).length})</button>
              ))}
            </div>
            <div style={{ background:'#FFFDF9', border:'1px solid #EAE0D5' }}>
              {filteredInvoices.length===0? <div style={{ padding:'20px', textAlign:'center', color:'#999' }}>No invoices found</div> :
                filteredInvoices.map(inv=>(
                  <div key={inv.id} onClick={()=>setSelectedInvoice(inv)} style={{ padding:'16px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', cursor:'pointer', background: selectedInvoice?.id===inv.id?'#FFF0E8':'transparent' }}>
                    <span style={{ flex:1 }}>{inv.client} - {inv.items}</span><span style={{ fontFamily:'DM Mono' }}>${inv.amount}</span>
                    <span style={{ marginLeft:'12px', padding:'4px 10px', borderRadius:'12px', fontSize:'11px', background: inv.status==='paid'?'#d4edda': inv.status==='overdue'?'#f8d7da':'#fff3cd' }}>{inv.status}</span>
                  </div>
                ))}
            </div>
            {selectedInvoice && (
              <div style={{ marginTop:'20px', padding:'20px', background:'white', border:'2px solid #E85D2A', borderRadius:'12px' }}>
                <h3 style={{ margin:0 }}>Invoice #{selectedInvoice.id}</h3>
                <p style={{ fontSize:'13px' }}>Client: {selectedInvoice.client} | Amount: ${selectedInvoice.amount} | Status: {selectedInvoice.status}</p>
                <div style={{ display:'flex', gap:'10px', marginTop:'12px' }}>
                  <button onClick={()=>generatePDF(selectedInvoice)} style={{ padding:'10px 20px', background:'#E85D2A', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600 }}>Download PDF</button>
                  <button onClick={()=>{ setInvoices(invoices.map(i=> i.id===selectedInvoice.id? {...i, status: i.status==='paid'?'pending':'paid'}: i)); setSelectedInvoice(null); }} style={{ padding:'10px 20px', background:'#121214', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' }}>Toggle Paid/Pending</button>
                  <button onClick={()=>setSelectedInvoice(null)} style={{ padding:'10px 20px', background:'white', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer' }}>Close</button>
                </div>
              </div>
            )}
          </div>
        )}
        {tab==="Time" && (
          <div>
            <h2 style={{ margin:0 }}>Time Tracker</h2>
            <p style={{ fontSize:'12px', color:'#888', marginTop:'4px' }}>Track work hours for accurate client billing</p>
            <div style={{ background:'white', border:'1px solid #EAE0D5', borderRadius:'12px', padding:'30px', marginTop:'20px', textAlign:'center' }}>
              <input value={trackedProject} onChange={e=>setTrackedProject(e.target.value)} placeholder="Project name (e.g. Vesper App)" style={{ width:'60%', padding:'12px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'20px' }} />
              <div style={{ fontSize:'48px', fontFamily:'DM Mono', fontWeight:700, margin:'20px 0' }}>{Math.floor(seconds/3600).toString().padStart(2,'0')}:{(Math.floor(seconds/60)%60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}</div>
              <div style={{ fontSize:'14px', color:'#888', fontFamily:'DM Mono' }}>Rate: $65/hour | Earned: ${earnedNow}</div>
              <div style={{ marginTop:'20px', display:'flex', gap:'12px', justifyContent:'center' }}>
                <button onClick={()=>setIsTracking(!isTracking)} style={{ padding:'12px 24px', background: isTracking?'#ff4444':'#121214', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600 }}>{isTracking?'Stop':'Start Timer'}</button>
                <button onClick={()=>{setSeconds(0); setIsTracking(false);}} style={{ padding:'12px 24px', background:'white', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer' }}>Reset</button>
                <button onClick={()=>{ if(trackedProject && seconds>0){ alert(`${trackedProject}: ${Math.floor(seconds/60)} min - $${earnedNow}`); setSeconds(0); setIsTracking(false);} }} style={{ padding:'12px 24px', background:'#E85D2A', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' }}>Save Log</button>
              </div>
            </div>
          </div>
        )}
        {tab==="Clients" && <div><h2>Clients</h2>{[...new Set(projects.map(p=>p.client))].map(c=> <div key={c} style={{ padding:'12px', background:'white', border:'1px solid #eee', marginBottom:'8px' }}>{c} - Total Billed: ${projects.filter(p=>p.client===c).reduce((a,b)=>a+b.amount,0)}</div>)}</div>}
      </div>
    </div>
  );
}