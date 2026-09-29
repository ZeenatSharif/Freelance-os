import { useState } from "react";

export default function App() {
  const [showAll, setShowAll] = useState(false);
  
  const [invoices, setInvoices] = useState([
    { id: 1, client: "Nimbus Co", project: "Nimbus Dashboard", amount: 2150, status: "paid", progress: 100, tasks: [{title:"Design", done:true},{title:"Code", done:true}] },
    { id: 2, client: "Arkio", project: "Arkio Website", amount: 6000, status: "pending", tasks: [{title:"Design", done:true},{title:"Code", done:false},{title:"Testing", done:false}] },
    { id: 3, client: "Vesper", project: "Vesper App", amount: 4000, status: "pending", tasks: [{title:"Design", done:true},{title:"Code", done:true},{title:"Delivery", done:false}] },
    { id: 4, client: "Zukhzuf", project: "galleryapp", amount: 500, status: "pending", tasks: [{title:"Design", done:false},{title:"Code", done:false}] },
  ]);

  // Automatic progress from tasks
  const getProgress = (tasks) => {
    if(!tasks || tasks.length === 0) return 0;
    const done = tasks.filter(t => t.done).length;
    return Math.round((done / tasks.length) * 100);
  };

  const toggleTask = (invoiceId, taskIndex) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? {
        ...inv,
        tasks: inv.tasks.map((t, i) => i === taskIndex ? {...t, done: !t.done} : t)
      } : inv
    ));
  };

  // Calculations
  const paid = invoices.filter(i => i.status === 'paid');
  const active = invoices.filter(i => i.status !== 'paid');
  
  const totalEarned = paid.reduce((s, i) => s + i.amount, 0);
  const invoicesDue = active.reduce((s, i) => s + i.amount, 0);
  const avgValue = invoices.length > 0 ? Math.round((totalEarned + invoicesDue) / invoices.length) : 0;

  // View All logic
  const visiblePolls = showAll ? active : active.slice(0, 4);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top 4 Boxes */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">Total Earned: ${totalEarned}</div>
        <div className="bg-white p-4 rounded-xl shadow">Active Projects: {active.length}</div>
        <div className="bg-white p-4 rounded-xl shadow">Invoices Due: ${invoicesDue}</div>
        <div className="bg-white p-4 rounded-xl shadow">Avg Value: ${avgValue}</div>
      </div>

      {/* Polls / Progress Lines */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Active Projects Progress</h2>
        {visiblePolls.map(inv => {
          const progress = getProgress(inv.tasks);
          return (
            <div key={inv.id} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{inv.project} - ${inv.amount} ({progress}%)</span>
                <span>{inv.tasks.filter(t=>t.done).length}/{inv.tasks.length} tasks</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div className="bg-green-500 h-3 rounded-full" style={{width: `${progress}%`}}></div>
              </div>
              <div className="flex gap-2 mt-2">
                {inv.tasks.map((t, idx) => (
                  <label key={idx} className="text-xs flex items-center gap-1">
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(inv.id, idx)} />
                    {t.title}
                  </label>
                ))}
              </div>
            </div>
          )
        })}
        
        {active.length > 4 && (
          <button onClick={() => setShowAll(!showAll)} className="mt-4 text-blue-600 text-sm font-bold">
            {showAll ? "Show Less ▲" : `View All Projects (${active.length}) ▼`}
          </button>
        )}
      </div>
    </div>
  )
}