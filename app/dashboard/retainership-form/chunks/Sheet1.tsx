"use client";

export default function RetainershipFormTemplate() {
  return (
    <div className="bg-white font-serif text-black p-4 max-w-5xl mx-auto text-sm">
      {/* Header */}
      <div className="flex items-start border border-black">
        {/* Logo placeholder */}
        <div className="w-36 h-24 border-r border-black flex items-center justify-center text-xs text-gray-400">
          [LOGO]
        </div>
        {/* Title block */}
        <div className="flex-1 flex items-center justify-center border-r border-black px-4 py-2">
          <h1 className="text-2xl font-bold text-center leading-tight">
            CLIENT&apos;S RETAINERSHIP FORM<br />(GUARD SECURITY SERVICES)
          </h1>
        </div>
        {/* Code block */}
        <div className="w-48 text-xs">
          <div className="flex border-b border-black">
            <span className="font-bold px-2 py-1 w-28 border-r border-black">CODE:</span>
            <span className="px-2 py-1">S60-F13</span>
          </div>
          <div className="flex border-b border-black">
            <span className="font-bold px-2 py-1 w-28 border-r border-black">ISSUE:</span>
            <span className="px-2 py-1">1</span>
          </div>
          <div className="flex border-b border-black">
            <span className="font-bold px-2 py-1 w-28 border-r border-black">Date of issue:</span>
            <span className="px-2 py-1">3/2/2020</span>
          </div>
          <div className="flex">
            <span className="font-bold px-2 py-1 w-28 border-r border-black">REVISION DATE:</span>
            <span className="px-2 py-1"></span>
          </div>
        </div>
      </div>

      {/* ISO standard */}
      <div className="border border-t-0 border-black">
        <div className="px-2 py-1 font-bold text-center border-b border-black">
          According to Standard ISO 9001-2015
        </div>

        {/* Contract detail banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black">
          CONTRACT DETAIL: ACTIVATION / ADDITION / EXPANSION
        </div>

        {/* Client info rows */}
        <div className="flex border-b border-black">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">CLIENT NAME:</span>
          <span className="flex-1 px-2 py-1"></span>
        </div>
        <div className="flex border-b border-black">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">CLIENT OFFICE ADDRESS:</span>
          <span className="flex-1 px-2 py-1 min-h-[38px]"></span>
        </div>
        <div className="flex border-b border-black">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">LOCATION NAME/ADDRESS:</span>
          <span className="flex-1 px-2 py-1 min-h-[40px]"></span>
        </div>

        {/* Starting date + activation */}
        <div className="flex border-b border-black">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">STARTING DATE:</span>
          <span className="flex-1 px-2 py-1 border-r border-black"></span>
          <span className="font-bold px-2 py-1 w-36 border-r border-black">NEW ACTIVATION:</span>
          <span className="px-2 py-1 w-16 bg-green-400 font-bold text-center"></span>
        </div>

        {/* Payment cycle + addition */}
        <div className="flex border-b border-black">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">PAYMENT CYCLE:</span>
          <span className="flex-1 px-2 py-1 border-r border-black">Monthly</span>
          <span className="font-bold px-2 py-1 w-36 border-r border-black">ADDITION:</span>
          <span className="px-2 py-1 w-16"></span>
        </div>

        {/* Contact details banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black">
          CONTACT DETAILS:
          <span className="float-right font-normal text-xs">EXPANSION</span>
        </div>

        {/* Contact header */}
        <div className="flex border-b border-black text-xs font-bold">
          <span className="px-2 py-1 w-36 border-r border-black">DESIGNATION</span>
          <span className="flex-1 px-2 py-1 border-r border-black">NAME</span>
          <span className="w-36 px-2 py-1 border-r border-black">MOBILE NO.</span>
          <span className="flex-1 px-2 py-1">EMAIL ADDRESS</span>
        </div>
        {["SERVICE CONTACT:", "FINANCIAL CONTACT:", "FACILITY MANAGER:"].map((label) => (
          <div key={label} className="flex border-b border-black text-xs">
            <span className="px-2 py-1 w-36 border-r border-black">{label}</span>
            <span className="flex-1 px-2 py-1 border-r border-black min-h-[24px]"></span>
            <span className="w-36 px-2 py-1 border-r border-black"></span>
            <span className="flex-1 px-2 py-1 text-blue-600 underline"></span>
          </div>
        ))}

        {/* Territorial details banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black">
          TERRITORIAL DETAILS/ CLASSIFICATION
        </div>

        {/* Territorial rows */}
        {[
          { left: "REGION", lval: "LAGOS", right: "HOD IN CHARGE", rval: "TOMIWA OWOLAGBA" },
          { left: "ZONE / AREA", lval: "MAINLAND", right: "OPERATIONS MANAGER", rval: "JONH GOJA" },
          { left: "OPS. OFFICER IN CHARGE", lval: "PIUS OCHOLI", right: "CREDIT CONTROLLER (REGION)", rval: "OLUWAGBENGA KUDAYISI" },
          { left: "RESPONSIBLE STAFF", lval: "JAMES", right: "BUSINESS DEV. MANAGER", rval: "SEUN AMUSAN" },
        ].map((row, i) => (
          <div key={i} className="flex border-b border-black text-xs">
            <span className="font-bold px-2 py-1 w-36 border-r border-black">{row.left}</span>
            <span className="px-2 py-1 w-28 text-center border-r border-black">{row.lval}</span>
            <span className="font-bold px-2 py-1 flex-1 border-r border-black">{row.right}</span>
            <span className="px-2 py-1 w-44 text-center">{row.rval}</span>
          </div>
        ))}

        {/* Service Requirement banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black">
          SERVICE REQUIREMENT
        </div>

        {/* Service table header */}
        <div className="flex border-b border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">GRADE (Male/Female)</span>
          <span className="w-24 px-2 py-1 border-r border-black">Shift Pattern 12hrs/24hrs</span>
          <span className="w-24 px-2 py-1 border-r border-black">Guard Monthly Net</span>
          <span className="w-10 px-2 py-1 border-r border-black text-center">No.</span>
          <span className="w-32 px-2 py-1 border-r border-black">Gross Billing Per Guard</span>
          <span className="w-36 px-2 py-1">Billing Per Month (Naira)</span>
        </div>

        {/* Service rows */}
        {["GUARDS", "HEAD GUARD", "SUPERVISOR", "CONTROL ROOM OPS", "CM/QM", "MOPOL"].map((grade) => (
          <div key={grade} className="flex border-b border-black text-xs">
            <span className="font-bold flex-1 px-2 py-1 border-r border-black">{grade}</span>
            <span className="w-24 px-2 py-1 border-r border-black text-center"></span>
            <span className="w-24 px-2 py-1 border-r border-black text-center"></span>
            <span className="w-10 px-2 py-1 border-r border-black text-center font-bold"></span>
            <span className="w-32 px-2 py-1 border-r border-black text-right"></span>
            <span className="w-36 px-2 py-1 text-right">₦0.00</span>
          </div>
        ))}

        {/* Service total */}
        <div className="flex border-b-2 border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">TOTAL</span>
          <span className="w-24 px-2 py-1 border-r border-black"></span>
          <span className="w-24 px-2 py-1 border-r border-black"></span>
          <span className="w-10 px-2 py-1 border-r border-black text-center">0</span>
          <span className="w-32 px-2 py-1 border-r border-black"></span>
          <span className="w-36 px-2 py-1 text-right">₦0.00</span>
        </div>

        {/* Equipment banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black">
          EQUIPMENT / OTHER ACCESSORIES
        </div>

        {/* Equipment header */}
        <div className="flex border-b border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">DEVICE</span>
          <span className="w-24 px-2 py-1 border-r border-black text-center">Unit cost (Naira)</span>
          <span className="w-10 px-2 py-1 border-r border-black">No.</span>
          <span className="w-32 px-2 py-1 border-r border-black">Monthly Service Cost</span>
          <span className="w-36 px-2 py-1">Billing per Month (Naira)</span>
        </div>

        {/* Equipment rows */}
        {["GUARDS TOUR", "WALKIE TALKIE RADIO", "CUG", "UNDERBELLY MIRROR", ""].map((device, i) => (
          <div key={i} className="flex border-b border-black text-xs">
            <span className="font-bold flex-1 px-2 py-1 border-r border-black">{device}</span>
            <span className="w-24 px-2 py-1 border-r border-black text-center"></span>
            <span className="w-10 px-2 py-1 border-r border-black"></span>
            <span className="w-32 px-2 py-1 border-r border-black"></span>
            <span className="w-36 px-2 py-1"></span>
          </div>
        ))}

        {/* Equipment total */}
        <div className="flex border-b-2 border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">TOTAL</span>
          <span className="w-24 px-2 py-1 border-r border-black"></span>
          <span className="w-10 px-2 py-1 border-r border-black"></span>
          <span className="w-32 px-2 py-1 border-r border-black"></span>
          <span className="w-36 px-2 py-1 text-right">₦0.00</span>
        </div>
      </div>

      {/* Approval signatures */}
      {[
        { role: "BUSINESS DEV. MANAGER", name: "SEUN AMUSAN", date: "DATE:22/10/2025" },
        { role: "HUMAN RESOURCES MANAGER", name: "FUNMILOLA ARIBIRE", date: "DATE:" },
        { role: "OPERATION MANAGER", name: "AONDOHEMBA GOJA", date: "DATE:" },
        { role: "GENRAL MANAGER / COO", name: "TOMIWA OWOLAGBA", date: "DATE:" },
        { role: "AUDIT INTERNAL", name: "", date: "DATE:" },
        { role: "HEAD OF FINANCE", name: "OLUWAGBENGA KUDAYISI", date: "DATE:" },
      ].map((approver, i) => (
        <div key={i} className="border border-t-0 border-black">
          <div className="bg-[#bf9000] px-2 py-1 text-xs font-bold border-b border-black">
            {approver.role}
          </div>
          <div className="flex border-b border-black text-xs">
            <span className="flex-1 px-2 py-1 font-bold border-r border-black">
              NAME: {approver.name}
            </span>
            <span className="flex-1 px-2 py-1 font-bold border-r border-black">SIGNATURE:</span>
            <span className="w-44 px-2 py-1 font-bold">{approver.date}</span>
          </div>
        </div>
      ))}

      {/* Checklist */}
      <div className="border border-t-0 border-black px-2 py-2 text-xs">
        <p className="font-bold underline mb-1">Please include and tick</p>
        <p className="mb-1">Proposal Letter</p>
        <p className="mb-1">Risk Assessment</p>
        <p>Manning Structure</p>
      </div>
    </div>
  );
}