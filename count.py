import os

def collect_code(folder_path, output_file="output.txt"):
    """Collects all lines of code from JavaScript files in a folder.

    Args:
        folder_path (str): The path to the project folder.
        output_file (str): The name of the file to store the code.
    """

    with open(output_file, "w", encoding='utf-8') as outfile:  # Open in write mode to overwrite
        for root, _, files in os.walk(folder_path):
            # Skip node_modules and env directories
            if 'node_modules' in root or '.env' in root:
                continue
            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read() + "\n")  # Add newline after each file

if __name__ == "__main__":
    project_folder = "C:\\Users\\Dell\\OneDrive\\Desktop\\qamar\\Projects\\LearnXcellence\\flask_server"  # Replace with your project folder path
    collect_code(project_folder)
    print("All JavaScript code collected and saved to 'output.txt'")