from enum import Enum

class GestureType(Enum):
    """
    Enum representing different hand gesture types for multi-modal control.
    """
    NEUTRAL = 0
    PINCH = 1
    FIST = 2
    OPEN_PALM = 3
    POINTING = 4
    WAVE = 5
    GRAB = 6
    RELEASE = 7
