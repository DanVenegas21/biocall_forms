"use client";

import { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  FileBadge,
  Users,
  Scale,
  Save,
  Sparkles,
  Hammer,
  type LucideIcon,
} from "lucide-react";
import { BIO_CALL_SECTIONS, type BioCallSectionId } from "@biocall/shared";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionPanel } from "@/components/ui/SectionPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassButton } from "@/components/glass/GlassButton";
import { Tooltip } from "@/components/ui/Tooltip";
import toast from "react-hot-toast";

// Importación de componentes de sección
import { PersonalDataSection } from "./sections/PersonalDataSection";
import { ContactSection } from "./sections/ContactSection";
import { AddressSection } from "./sections/AddressSection";
import { DocumentsSection } from "./sections/DocumentsSection";
import { FamilySection } from "./sections/FamilySection";
import { CaseSection } from "./sections/CaseSection";

/** Icono asociado a cada seccion (la metadata vive en @biocall/shared). */
const SECTION_ICONS: Record<BioCallSectionId, LucideIcon> = {
  "datos-personales": User,
  contacto: Phone,
  domicilio: MapPin,
  documentos: FileBadge,
  familia: Users,
  caso: Scale,
};

export function BioCallForm() {
  // --- Estado unificado del formulario ---
  const [formData, setFormData] = useState({
    personalData: {
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: "",
      lugarNacimiento: "",
      sexo: "",
      estadoCivil: "",
      nacionalidad: "",
      comprendeIngles: "",
      idiomaPreferido: "",
      hablaOtroIdioma: "",
      especificarIdioma: "",
      otrosNombres: "",
    },
    contact: {
      telefono: "",
      correoElectronico: "",
    },
    address: {
      direccionCompleta: "",
      fechaIngreso: "",
    },
    documents: {
      tienePasaporte: "",
      pasaportePendiente: "",
      numeroPasaporte: "",
      paisEmision: "",
      fechaEmision: "",
      fechaExpiracion: "",
      tieneANumber: "",
      aNumberValue: "",
      aNumberOrigen: "",
      tieneSSN: "",
      ssnValue: "",
      tieneEAD: "",
      eadValue: "",
    },
    family: {
      tieneConyuge: "",
      nombresConyuge: "",
      apellidoPaternoConyuge: "",
      apellidoMaternoConyuge: "",
      tieneHijos: "",
      cantidadHijos: "" as number | "",
    },
    caseBackground: {
      fechaEntrada: "",
      formaEntrada: "",
      lugarEntrada: "",
      detenidoAlIngresar: "",
      detenidoInmigracion: "",
      cantidadDetencionesInmi: "" as number | "",
      detallesDetencionesInmi: "",
      inmiFotosHuellas: "",
      inmiOrdenDeportacion: "",
      inmiCitaCorte: "",
      inmiRegresoVoluntario: "",
      inmiCastigoSancion: "",
      arrestadoPolicia: "",
      cantidadArrestosPoli: "" as number | "",
      explicacionArresto: "",
      arrestoMotivo: "",
      arrestoFecha: "",
      arrestoLugar: "",
      arrestoPasoNocheCarcel: "",
      arrestoPagoFianza: "",
      arrestoMontoFianza: "",
      arrestoResolucion: "",
      declaradoCiudadano: "",
      foiaRequerir: "",
    },
  });

  // Helper para actualizar secciones del formulario de manera tipada
  const updateSection = <K extends keyof typeof formData>(
    section: K,
    fields: Partial<(typeof formData)[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...fields,
      },
    }));
  };

  // Indica si el usuario ha comenzado a llenar el formulario (para habilitar el botón Guardar)
  const isFormDirty = Object.values(formData).some((section) =>
    Object.values(section).some((value) => {
      if (typeof value === "string") return value.trim() !== "";
      if (typeof value === "number") return true;
      return false;
    })
  );

  // Acción para guardar el formulario
  const handleSave = () => {
    toast.success("¡Datos guardados localmente con éxito!");
    console.log("Datos de la Bio Call guardados:", formData);
  };

  const renderSectionContent = (sectionId: BioCallSectionId) => {
    switch (sectionId) {
      case "datos-personales":
        return (
          <PersonalDataSection
            data={formData.personalData}
            onChange={(fields) => updateSection("personalData", fields)}
          />
        );
      case "contacto":
        return (
          <ContactSection
            data={formData.contact}
            onChange={(fields) => updateSection("contact", fields)}
          />
        );
      case "domicilio":
        return (
          <AddressSection
            data={formData.address}
            onChange={(fields) => updateSection("address", fields)}
          />
        );
      case "documentos":
        return (
          <DocumentsSection
            data={formData.documents}
            onChange={(fields) => updateSection("documents", fields)}
          />
        );
      case "familia":
        return (
          <FamilySection
            data={formData.family}
            onChange={(fields) => updateSection("family", fields)}
          />
        );
      case "caso":
        return (
          <CaseSection
            data={formData.caseBackground}
            onChange={(fields) => updateSection("caseBackground", fields)}
          />
        );
      default:
        return (
          <EmptyState
            compact
            icon={<Hammer className="h-7 w-7" aria-hidden="true" />}
            title="Sección pendiente de implementar"
            description="Aquí se colocarán los campos de captura correspondientes para esta sección de la Bio Call."
          />
        );
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Cabecera de pagina */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="page-title">Bio Call del cliente</h1>
            <p className="page-subtitle">
              Captura de información personal para generar el documento de la Bio Call.
            </p>
          </div>

          {/* Barra de acciones */}
          <div className="dashboard-action-bar">
            <Tooltip content="Disponible al implementar autocompletado">
              <span>
                <GlassButton
                  variant="ai"
                  size="sm"
                  leftIcon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                  disabled
                >
                  Autocompletar con IA
                </GlassButton>
              </span>
            </Tooltip>
            <Tooltip content={isFormDirty ? "Guardar información de la Bio Call" : "Completa información para guardar"}>
              <span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
                  disabled={!isFormDirty}
                  onClick={handleSave}
                >
                  Guardar Bio Call
                </GlassButton>
              </span>
            </Tooltip>
          </div>
        </header>

        {/* Layout principal: indice + secciones */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Indice de secciones */}
          <aside className="lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)] lg:self-start">
            <nav
              aria-label="Secciones de la Bio Call"
              className="solid-panel p-3"
            >
              <p className="label-caps px-2 pb-2">Secciones</p>
              <ul className="space-y-1">
                {BIO_CALL_SECTIONS.map((section) => {
                  const Icon = SECTION_ICONS[section.id];
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="nav-tab w-full justify-start"
                      >
                        <Icon
                          className="h-4 w-4 text-brand-500"
                          aria-hidden="true"
                        />
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Contenido: una seccion por bloque de la Bio Call */}
          <div className="space-y-6">
            {BIO_CALL_SECTIONS.map((section, index) => {
              const Icon = SECTION_ICONS[section.id];
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <SectionPanel
                    title={section.title}
                    description={section.description}
                    icon={<Icon className="h-5 w-5" aria-hidden="true" />}
                    accent={index === 0}
                  >
                    {renderSectionContent(section.id)}
                  </SectionPanel>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}


