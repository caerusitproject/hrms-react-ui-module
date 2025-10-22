// variable-palette.jsx (Fixed)
"use client"

import { useState } from "react";
import { Box, Typography, Button, TextField, Chip } from '@mui/material';
import { Plus } from 'lucide-react';
import { theme } from '../../theme/theme';

export default function VariablePalette({ predefinedVars, onInsert, onAddCustom, usedVars }) {
  const [customVar, setCustomVar] = useState('');

  return (
    <Box style={theme.variablesPalette}>
      <Typography variant="subtitle2" style={{ ...theme.paletteHint }}>Predefined Variables</Typography>
      {predefinedVars.map((varName) => (
        <Button
          key={varName}
          onClick={() => onInsert(varName)}
          style={theme.variableInsertBtn}
          fullWidth
        >
          {`{{${varName}}}`}
        </Button>
      ))}

      <Box style={theme.customVarSection}>
        <TextField
          size="small"
          placeholder="Custom var"
          value={customVar}
          onChange={(e) => setCustomVar(e.target.value)}
          style={theme.customVarInput}
        />
        <Button
          onClick={() => {
            onAddCustom(customVar);
            setCustomVar('');
          }}
          startIcon={<Plus size={16} />}
          style={theme.addVarBtn}
        >
          Add
        </Button>
      </Box>

      {usedVars.length > 0 && (
        <>
          <Typography variant="subtitle2" style={{ ...theme.paletteHint }}>Used Variables</Typography>
          <Box style={theme.usedVariables}>
            {usedVars.map((v) => (
              <Chip
                key={v}
                label={`{{${v}}}`}
                onClick={() => onInsert(v)}
                style={theme.usedChip}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}