export default function PatientDetailsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <aside className="md:col-span-4 lg:col-span-3 space-y-6">
        <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
           <div className="flex flex-col items-center text-center gap-4">
              <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary border-2 border-secondary/20">
                JS
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">João Silva</h2>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Diagnóstico: TEA</span>
              </div>
           </div>
           
           <hr className="my-6 border-border/40" />
           
           <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Responsável</span>
                <span className="text-sm font-medium">Maria Silva (Mãe)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Contato</span>
                <span className="text-sm font-medium">(51) 99887-6655</span>
              </div>
           </div>
        </div>
      </aside>

      <main className="md:col-span-8 lg:col-span-9 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">Histórico de Evoluções</h3>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
            + Nova Sessão
          </button>
        </div>

        <div className="relative pl-8 border-l-2 border-secondary/20 space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="relative bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:border-secondary/30 transition-all">
              <div className="absolute -left-[41px] top-8 h-4 w-4 rounded-full bg-secondary border-4 border-background" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">2{i} Março, 2026</span>
                <span className="text-xs text-muted-foreground italic">Duração: 50min</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Paciente apresentou boa regulação sensorial hoje. Trabalhamos atividades de motricidade fina com foco em pinça. Demonstrou resistência inicial, mas finalizou a tarefa com suporte verbal.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}