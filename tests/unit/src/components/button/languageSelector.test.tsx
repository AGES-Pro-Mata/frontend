import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSelect from "@/components/button/languageSelector";

let language = "pt";
const changeLanguage = vi.fn((lng: string) => {
  language = lng;
});
const navigate = vi.fn();
let routerState: { location: { search?: { lang?: string } } } = {
  location: { search: {} },
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language, changeLanguage },
    t: (key: string) => key,
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
  useRouterState: () => routerState,
}));

describe("LanguageSelect", () => {
  beforeEach(() => {
    language = "pt";
    routerState = { location: { search: {} } };
    navigate.mockClear();
    changeLanguage.mockClear();
  });

  it("syncs language from url and sets EN via click", async () => {
    routerState.location.search = { lang: "en" };

    render(<LanguageSelect className="custom" />);

    // effect syncs i18n with url
    expect(changeLanguage).toHaveBeenCalledWith("en");

    await userEvent.click(screen.getByLabelText("Switch to English"));

    const navArgs = navigate.mock.calls.at(-1)?.[0] as {
      replace?: boolean;
      to?: string;
      search?: (input: Record<string, string | undefined>) => Record<string, string | undefined>;
    };

    expect(navArgs.replace).toBe(true);
    expect(navArgs.to).toBe(".");
    expect(navArgs.search?.({})).toEqual({ lang: "en" });
  });

  it("uses drawer + horizontal styles and switches to PT", async () => {
    language = "en";
    render(<LanguageSelect orientation="horizontal" variant="drawer" />);

    expect(screen.getByText("PT").className).toContain("text-white/80");

    await userEvent.click(screen.getByLabelText("Mudar para Português"));

    expect(changeLanguage).toHaveBeenCalledWith("pt");
    const navArgs = navigate.mock.calls.at(-1)?.[0] as {
      search?: (input: Record<string, string | undefined>) => Record<string, string | undefined>;
    };

    expect(navArgs.search?.({ existing: "1" })).toEqual({
      existing: "1",
      lang: "pt",
    });
  });

  it("skips language change when already set and no lang param", async () => {
    language = "pt";
    render(<LanguageSelect />);

    await userEvent.click(screen.getByLabelText("Mudar para Português"));

    expect(changeLanguage).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith({
      to: ".",
      replace: true,
      search: expect.any(Function),
    });
  });

  it("returns early when no lang is present in the url", () => {
    render(<LanguageSelect />);

    expect(changeLanguage).not.toHaveBeenCalled();
  });
});
