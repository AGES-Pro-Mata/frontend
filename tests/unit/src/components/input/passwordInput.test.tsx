import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { PasswordInput } from "@/components/input/passwordInput";

describe("PasswordInput", () => {
	it("renders label, required marker and helper text when provided", () => {
		render(<PasswordInput label="Senha" required placeholder="Digite" />);

		expect(screen.getByText("Senha")).toBeInTheDocument();
		expect(screen.getByText("*")).toBeInTheDocument();
		expect(screen.getByText("Min 8 caracteres")).toBeInTheDocument();
	});

	it("does not render label when omitted", () => {
		render(<PasswordInput placeholder="Digite" />);

		expect(screen.queryByText("Senha")).toBeNull();
	});

	it("toggles password visibility when clicking the action button", () => {
		render(<PasswordInput placeholder="Digite" />);

		const input = screen.getByPlaceholderText<HTMLInputElement>("Digite");
		const toggle = screen.getByRole("button", { name: "Mostrar senha" });

		expect(input.type).toBe("password");

		fireEvent.click(toggle);
		expect(input.type).toBe("text");
		expect(toggle).toHaveAttribute("aria-label", "Ocultar senha");

		fireEvent.click(toggle);
		expect(input.type).toBe("password");
		expect(toggle).toHaveAttribute("aria-label", "Mostrar senha");
	});

	it("marks the field invalid after blur when required and empty, then clears once filled", async () => {
		const { rerender } = render(
			<PasswordInput required placeholder="Digite" className="custom-class" />
		);

		const input = screen.getByPlaceholderText<HTMLInputElement>("Digite");

		expect(input.getAttribute("aria-invalid")).toBe("false");

		fireEvent.focus(input);
		fireEvent.blur(input);

		await waitFor(() => {
			expect(input.getAttribute("aria-invalid")).toBe("true");
			expect(input.className).toContain("border-default-red");
			expect(input.className).toContain("custom-class");
		});

		rerender(<PasswordInput required placeholder="Digite" value="filled" className="custom-class" />);

		await waitFor(() => {
			expect(input.getAttribute("aria-invalid")).toBe("false");
			expect(input.className).not.toContain("border-default-red");
		});
	});

	it("forwards change handler and displays provided error message", () => {
		const handleChange = vi.fn();

		render(
			<PasswordInput
				placeholder="Digite"
				onChange={handleChange}
				error="Senha inválida"
			/>
		);

		const input = screen.getByPlaceholderText<HTMLInputElement>("Digite");

		fireEvent.change(input, { target: { value: "123" } });
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Senha inválida")).toBeInTheDocument();
	});
});
