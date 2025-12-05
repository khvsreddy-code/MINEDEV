# NPC Dialog Generator
# AI-powered dialog generation for game NPCs

import random
from typing import List, Dict

class NPCDialogGenerator:
    """Generate contextual NPC dialog"""
    
    def __init__(self):
        self.personality_templates = {
            'friendly': {
                'greetings': ["Hello there!", "Good to see you!", "Welcome, friend!"],
                'farewells': ["Take care!", "Safe travels!", "Come back soon!"],
                'trades': ["I have some goods for you!", "Looking to buy or sell?"]
            },
            'mysterious': {
                'greetings': ["...", "You've come far.", "Interesting timing."],
                'farewells': ["We'll meet again.", "The path ahead is unclear.", "Go, if you must."],
                'quests': ["I have a task, if you dare accept it."]
            },
            'aggressive': {
                'greetings': ["What do you want?", "State your business!", "Move along!"],
                'farewells': ["Get out of here!", "Don't come back!", "Hmph."],
                'threats': ["Don't test me!", "I'm warning you!"]
            },
            'wise': {
                'greetings': ["Ah, a visitor.", "Welcome, seeker.", "I sensed your approach."],
                'advice': ["Listen carefully...", "The wise know when to wait.", "Patience is key."],
                'farewells': ["May wisdom guide you.", "Remember my words."]
            }
        }
    
    def generate_dialog(self, npc_type: str, context: str, character_name: str = "Stranger") -> Dict:
        """
        Generate contextual NPC dialog
        
        Args:
            npc_type: 'merchant', 'guard', 'quest_giver', 'villager', etc.
            context: 'greeting', 'farewell', 'trade', 'quest', 'combat', etc.
            character_name: Name of the NPC
        
        Returns:
            Dialog data with text, emotions, and choices
        """
        
        # Determine personality based on NPC type
        personality_map = {
            'merchant': 'friendly',
            'guard': 'aggressive',
            'wizard': 'mysterious',
            'elder': 'wise',
            'villager': 'friendly',
            'quest_giver': 'wise',
            'enemy': 'aggressive'
        }
        
        personality = personality_map.get(npc_type, 'friendly')
        templates = self.personality_templates[personality]
        
        # Generate dialog based on context
        dialog = {
            'npc_name': character_name,
            'npc_type': npc_type,
            'personality': personality,
            'context': context,
            'text': '',
            'emotion': 'neutral',
            'player_choices': []
        }
        
        if context == 'greeting':
            dialog['text'] = random.choice(templates.get('greetings', ["Hello."]))
            dialog['emotion'] = 'happy' if personality == 'friendly' else 'neutral'
            dialog['player_choices'] = [
                "[Greet back]",
                "[Ask about quests]",
                "[Leave]"
            ]
        
        elif context == 'farewell':
            dialog['text'] = random.choice(templates.get('farewells', ["Goodbye."]))
            dialog['emotion'] = 'neutral'
        
        elif context == 'trade' and npc_type == 'merchant':
            dialog['text'] = random.choice(templates.get('trades', ["Welcome to my shop!"]))
            dialog['emotion'] = 'happy'
            dialog['player_choices'] = [
                "[Buy items]",
                "[Sell items]",
                "[Browse]",
                "[Leave]"
            ]
        
        elif context == 'quest':
            dialog['text'] = random.choice(templates.get('quests', ["I need your help."]))
            dialog['emotion'] = 'serious'
            dialog['player_choices'] = [
                "[Accept quest]",
                "[Decline]",
                "[Ask for more information]"
            ]
        
        elif context == 'combat':
            dialog['text'] = random.choice(templates.get('threats', ["Prepare yourself!"]))
            dialog['emotion'] = 'angry'
        
        return dialog
    
    def generate_conversation_tree(self, npc_type: str, num_branches: int = 3) -> Dict:
        """
        Generate a branching conversation tree
        
        Returns:
            Full conversation tree with multiple branches
        """
        tree = {
            'start': self.generate_dialog(npc_type, 'greeting'),
            'branches': []
        }
        
        for i in range(num_branches):
            contexts = ['quest', 'trade', 'farewell']
            branch = {
                'choice_index': i,
                'dialog': self.generate_dialog(npc_type, contexts[i % len(contexts)])
            }
            tree['branches'].append(branch)
        
        return tree

# Example usage
if __name__ == "__main__":
    generator = NPCDialogGenerator()
    
    # Test dialog generation
    merchant_dialog = generator.generate_dialog('merchant', 'greeting', 'Bob the Trader')
    print("Merchant Dialog:", merchant_dialog)
    
    # Test conversation tree
    tree = generator.generate_conversation_tree('quest_giver')
    print("\nConversation Tree:", tree)
