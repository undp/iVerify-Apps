# project_avalon/run.py
import sys
import os

# Add project root to path (parent of project_avalon)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from project_avalon.avalon_core import main

if __name__ == "__main__":
    main()
