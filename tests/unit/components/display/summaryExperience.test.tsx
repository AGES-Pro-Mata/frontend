import { SummaryExperience } from "@/components/display";
import { renderWithProviders } from "@/test/test-utils";
import { screen } from "@testing-library/react";

describe("SummaryExperience",()=>{

  const experienceInfo = {
    experience: "Trilha Teste",
    startDate: "2025-10-12",
    endDate: "2025-10-20",
    price: 1500,
    capacity: 10,
    locale: "pt-BR" as const,
  };

  it("renders summaryExperience with basic info",()=>{
    renderWithProviders(<SummaryExperience {...experienceInfo}></SummaryExperience>)

    const titulo = screen.getByText("Trilha Teste");
    expect(titulo).toBeInTheDocument();

    const preco = screen.getByText("R$ 1500");
    expect(preco).toBeInTheDocument();

    const capacity = screen.getByText("10 pessoas");
    expect(capacity).toBeInTheDocument();
  })

  // it("formats date according to locale",()=>{
  //   renderWithProviders(<SummaryExperience {...experienceInfo}></SummaryExperience>)
    
  //   const datas = screen.getByText("12/10/2025 a 20/10/2025");
  //   expect(datas).toBeInTheDocument();
  // })

  it("renders all images",()=>{
    renderWithProviders(<SummaryExperience {...experienceInfo}></SummaryExperience>)

    const imgs = screen.getAllByRole("presentation");
    expect(imgs).toHaveLength(4);
  })

})
