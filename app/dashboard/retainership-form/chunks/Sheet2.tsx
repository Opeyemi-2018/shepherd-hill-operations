"use client";

export default function RetainershipFormFilled() {
  const serviceRows = [
    { grade: "GUARDS", shift: "24hrs", net: "70,000.00", no: "6", gross: "100,000.00", billing: "₦600,000.00" },
    { grade: "HEAD GUARD", shift: "", net: "", no: "", gross: "", billing: "₦0.00" },
    { grade: "SUPERVISORS", shift: "", net: "", no: "", gross: "", billing: "₦0.00" },
    { grade: "CONTROL ROOM OPS", shift: "", net: "", no: "", gross: "", billing: "₦0.00" },
    { grade: "CM", shift: "", net: "", no: "", gross: "", billing: "₦0.00" },
    { grade: "MOPOL/ARMED GUARD", shift: "", net: "", no: "", gross: "", billing: "₦0.00" },
  ];

  const approvers = [
    { role: "BUSINESS DEV. MANAGER / REGIONAL MANAGER", name: "SEUN AMUSAN", date: "DATE:1/4/2026" },
    { role: "HUMAN RESOURCES MANAGER", name: "KENETH UMUNNA", date: "DATE:" },
    { role: "GENRAL MANAGER / COO", name: "TOMIWA OWOLAGBA", date: "DATE:" },
    { role: "OPERATIONS MANAGER", name: "JOHN GOJA AONDOHEMBA", date: "DATE:" },
    { role: "HEAD OF FINANCE", name: "IDRIS ADELEYE", date: "DATE:" },
  ];

  return (
    <div className="bg-white font-serif text-black p-4 max-w-5xl mx-auto text-sm">
      {/* Header */}
      <div className="flex items-stretch border border-black">
        {/* Logo placeholder */}
        <div className="w-36 border-r border-black flex items-center justify-center text-xs text-gray-400 min-h-[96px]">
          [LOGO]
        </div>
        {/* Title */}
        <div className="flex-1 flex items-center justify-center border-r border-black px-4 py-2">
          <h1 className="text-2xl font-bold text-center leading-tight">
            CLIENT&apos;S RETAINERSHIP FORM<br />(GUARD SECURITY SERVICES)
          </h1>
        </div>
        {/* Code block */}
        <div className="w-48 text-xs flex flex-col">
          {[
            { label: "CODE:", value: "S60-F13" },
            { label: "ISSUE:", value: "1" },
            { label: "Date of issue:", value: "3/2/2020" },
            { label: "REVISION DATE:", value: "" },
          ].map((row, i) => (
            <div key={i} className={`flex ${i < 3 ? "border-b border-black" : ""}`}>
              <span className="font-bold px-2 py-1 w-28 border-r border-black">{row.label}</span>
              <span className="px-2 py-1 flex-1">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-t-0 border-black">
        {/* ISO */}
        <div className="px-2 py-1 font-bold text-center border-b border-black text-xs">
          According to Standard ISO 9001-2015
        </div>

        {/* Contract detail banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black text-xs">
          CONTRACT DETAIL: ACTIVATION / ADDITION / EXPANSION
        </div>

        {/* Client info */}
        <div className="flex border-b border-black text-xs">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">CLIENT NAME:</span>
          <span className="flex-1 px-2 py-1 font-bold">ABC</span>
        </div>
        <div className="flex border-b border-black text-xs">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">CLIENT OFFICE ADDRESS:</span>
          <span className="flex-1 px-2 py-1">12 Adeola street Ikeja Lagos</span>
        </div>
        <div className="flex border-b border-black text-xs">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">LOCATION NAME/ADDRESS:</span>
          <span className="flex-1 px-2 py-1 font-bold">ABC HEAD OFFICE</span>
        </div>

        {/* Starting date */}
        <div className="flex border-b border-black text-xs">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">STARTING DATE:</span>
          <span className="flex-1 px-2 py-1 border-r border-black font-bold">16/3//2026</span>
          <span className="font-bold px-2 py-1 w-36 border-r border-black">NEW ACTIVATION:</span>
          <span className="px-2 py-1 w-16 bg-green-400 font-bold text-center">Yes</span>
        </div>

        {/* Payment */}
        <div className="flex border-b border-black text-xs">
          <span className="font-bold px-2 py-1 w-48 border-r border-black shrink-0">PAYMENT CYCLE:</span>
          <span className="flex-1 px-2 py-1 border-r border-black">Monthly</span>
          <span className="font-bold px-2 py-1 w-36 border-r border-black">ADDITION:</span>
          <span className="px-2 py-1 w-16"></span>
        </div>

        {/* Contact details banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black text-xs">
          CONTACT DETAILS:
          <span className="float-right font-normal">EXPANSION</span>
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

        {/* Territorial banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black text-xs">
          TERRITORIAL DETAILS/ CLASSIFICATION
        </div>

        {[
          { left: "REGION", lval: "LAGOS", right: "HOD IN CHARGE", rval: "TOMIWA OWOLAGBA" },
          { left: "ZONE / AREA", lval: "ISLAND", right: "OPERATIONS MANAGER", rval: "JONH GOJA" },
          { left: "OPS. OFFICER IN CHARGE", lval: "ELVIS", right: "CREDIT CONTROLLER (REGION)", rval: "IDRIS ADELEYE" },
          { left: "RESPONSIBLE STAFF", lval: "SEUN AMUSAN", right: "BUSINESS DEV. MANAGER", rval: "SEUN AMUSAN" },
        ].map((row, i) => (
          <div key={i} className="flex border-b border-black text-xs">
            <span className="font-bold px-2 py-1 w-36 border-r border-black">{row.left}</span>
            <span className="px-2 py-1 w-28 text-center border-r border-black">{row.lval}</span>
            <span className="font-bold px-2 py-1 flex-1 border-r border-black">{row.right}</span>
            <span className="px-2 py-1 w-44 text-center">{row.rval}</span>
          </div>
        ))}

        {/* Service Requirement banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black text-xs">
          SERVICE REQUIREMENT
        </div>

        {/* Service header */}
        <div className="flex border-b border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">GRADE (Male/Female)</span>
          <span className="w-20 px-2 py-1 border-r border-black text-center">Shift Pattern</span>
          <span className="w-24 px-2 py-1 border-r border-black text-center">Guard Monthly Net</span>
          <span className="w-10 px-2 py-1 border-r border-black text-center">No.</span>
          <span className="w-32 px-2 py-1 border-r border-black text-right">Gross Billing Per Guard</span>
          <span className="w-36 px-2 py-1 text-right">Billing Per Month (Naira)</span>
        </div>

        {serviceRows.map((row, i) => (
          <div key={i} className="flex border-b border-black text-xs">
            <span className="font-bold flex-1 px-2 py-1 border-r border-black">{row.grade}</span>
            <span className="w-20 px-2 py-1 border-r border-black text-center">{row.shift}</span>
            <span className="w-24 px-2 py-1 border-r border-black text-center">{row.net}</span>
            <span className="w-10 px-2 py-1 border-r border-black text-center font-bold">{row.no}</span>
            <span className="w-32 px-2 py-1 border-r border-black text-right">{row.gross}</span>
            <span className="w-36 px-2 py-1 text-right">{row.billing}</span>
          </div>
        ))}

        {/* Service total */}
        <div className="flex border-b-2 border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">TOTAL</span>
          <span className="w-20 px-2 py-1 border-r border-black"></span>
          <span className="w-24 px-2 py-1 border-r border-black"></span>
          <span className="w-10 px-2 py-1 border-r border-black"></span>
          <span className="w-32 px-2 py-1 border-r border-black"></span>
          <span className="w-36 px-2 py-1 text-right">₦600,000.00</span>
        </div>

        {/* Equipment banner */}
        <div className="bg-[#bf9000] text-black font-bold px-2 py-1 text-center border-b border-black text-xs">
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

        {["GUARDS TOUR DEVICE", "WALKIE TALKIE RADIO", "CUG", "UNDERBELLY MIRROR", "OTHERS"].map((device) => (
          <div key={device} className="flex border-b border-black text-xs">
            <span className="font-bold flex-1 px-2 py-1 border-r border-black">{device}</span>
            <span className="w-24 px-2 py-1 border-r border-black text-center"></span>
            <span className="w-10 px-2 py-1 border-r border-black"></span>
            <span className="w-32 px-2 py-1 border-r border-black"></span>
            <span className="w-36 px-2 py-1"></span>
          </div>
        ))}

        {/* Equipment total */}
        <div className="flex border-b border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">TOTAL</span>
          <span className="w-24 px-2 py-1 border-r border-black"></span>
          <span className="w-10 px-2 py-1 border-r border-black"></span>
          <span className="w-32 px-2 py-1 border-r border-black"></span>
          <span className="w-36 px-2 py-1 text-right">₦0.00</span>
        </div>

        {/* Grand total */}
        <div className="flex border-b-2 border-black text-xs font-bold">
          <span className="flex-1 px-2 py-1 border-r border-black">TOTAL</span>
          <span className="w-24 px-2 py-1 border-r border-black"></span>
          <span className="w-10 px-2 py-1 border-r border-black"></span>
          <span className="w-32 px-2 py-1 border-r border-black"></span>
          <span className="w-36 px-2 py-1 text-right">₦0.00</span>
        </div>
      </div>

      {/* Signatures */}
      {approvers.map((approver, i) => (
        <div key={i} className="border border-t-0 border-black">
          <div className="bg-[#bf9000] px-2 py-1 text-xs font-bold border-b border-black">
            {approver.role}
          </div>
          <div className="flex text-xs">
            <span className="flex-1 px-2 py-2 font-bold border-r border-black">
              NAME: {approver.name}
            </span>
            <span className="flex-1 px-2 py-2 font-bold border-r border-black">SIGNATURE:</span>
            <span className="w-44 px-2 py-2 font-bold border-l border-black">{approver.date}</span>
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