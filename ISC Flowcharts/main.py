# main.py
import os
import webbrowser
import tkinter as tk
from tkinter import ttk, messagebox
import threading
import http.server
import socketserver
import time
import sys

# Define the port on which to serve the website
PORT = 8000

class ServerThread(threading.Thread):
    def __init__(self, handler):
        super().__init__()
        self.handler = handler
        self.httpd = None

    def run(self):
        try:
            with socketserver.TCPServer(("", PORT), self.handler) as httpd:
                self.httpd = httpd
                print(f"Serving at port {PORT}")
                httpd.serve_forever()
        except Exception as e:
            print(f"Server encountered an error: {e}")

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            print("Server stopped.")

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Infection Control Flowcharts Server")
        self.root.geometry("400x200")
        self.root.resizable(False, False)

        # Initialize server thread
        self.server_thread = None

        # Create GUI elements
        self.create_widgets()

        # Handle window close
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)

    def create_widgets(self):
        # Create a frame for the buttons
        frame = ttk.Frame(self.root, padding=20)
        frame.pack(expand=True)

        # Start Server Button
        self.start_button = ttk.Button(frame, text="Start Server", command=self.start_server)
        self.start_button.grid(row=0, column=0, padx=10, pady=10, sticky="ew")

        # Stop Server Button
        self.stop_button = ttk.Button(frame, text="Stop Server", command=self.stop_server, state="disabled")
        self.stop_button.grid(row=0, column=1, padx=10, pady=10, sticky="ew")

        # Status Label
        self.status_label = ttk.Label(frame, text="Status: Stopped", foreground="red")
        self.status_label.grid(row=1, column=0, columnspan=2, pady=10)

    def start_server(self):
        if self.server_thread and self.server_thread.is_alive():
            messagebox.showinfo("Info", "Server is already running.")
            return

        # Change working directory to the script's directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)

        # Define the handler to serve files from the current directory
        handler = http.server.SimpleHTTPRequestHandler

        # Start the server thread
        self.server_thread = ServerThread(handler)
        self.server_thread.start()

        # Update GUI elements
        self.start_button.config(state="disabled")
        self.stop_button.config(state="normal")
        self.status_label.config(text="Status: Running", foreground="green")

        # Open the web browser after a short delay to ensure the server starts
        threading.Thread(target=self.open_browser, daemon=True).start()

    def stop_server(self):
        if self.server_thread:
            self.server_thread.stop()
            self.server_thread.join()
            self.server_thread = None

            # Update GUI elements
            self.start_button.config(state="normal")
            self.stop_button.config(state="disabled")
            self.status_label.config(text="Status: Stopped", foreground="red")
            messagebox.showinfo("Info", "Server has been stopped.")

    def open_browser(self):
        # Wait briefly to ensure the server is up
        time.sleep(1)
        url = f"http://localhost:{PORT}/index.html"
        webbrowser.open(url)

    def on_closing(self):
        if self.server_thread and self.server_thread.is_alive():
            if messagebox.askokcancel("Quit", "Server is running. Do you want to quit?"):
                self.stop_server()
                self.root.destroy()
        else:
            self.root.destroy()

def main():
    root = tk.Tk()
    app = App(root)
    root.mainloop()

if __name__ == "__main__":
    main()
