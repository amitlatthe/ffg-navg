import Blockly from 'blockly';
import { Block } from 'blockly';


Blockly['Arduino']['delay_block'] = function(block) {
    let delay =
        Blockly['Arduino'].valueToCode(
            block,
            'DELAY',
            Blockly['Arduino'].ORDER_ATOMIC
        ) || 1;
    delay = Math.ceil(Math.abs(delay) * 1000);

    return 'delay(' + delay + ');\n';
};

Blockly['Arduino']['time_setup'] = function() {
    return '';
};
