'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function JoinPageEditor() {
  const [joinText, setJoinText] = useState({ 
    hero: {
      title: '',
      subtitle: '',
      badges: []
    },
    sections: [] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJoinText();
  }, []);

  const fetchJoinText = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/jointext', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      const data = await response.json();

      console.log('📥 Fetched join text:', data);
      console.log('📦 Sections count:', data.joinText?.sections?.length || 0);

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to load join text');
        return;
      }

      setJoinText(data.joinText || { 
        hero: {
          title: '',
          subtitle: '',
          badges: []
        },
        sections: [] 
      });
    } catch (error) {
      console.error('Error fetching join text:', error);
      setError('Failed to load join text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const username = sessionStorage.getItem('settings_username');
      const password = sessionStorage.getItem('settings_password');
      if (!username || !password) {
        setError('You must be logged in to save changes');
        return;
      }

      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      const response = await fetch('/api/jointext', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(joinText)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to save join text');
        return;
      }

      setSuccess('Join text saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving join text:', error);
      setError('Failed to save join text. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedJoinText = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const username = sessionStorage.getItem('settings_username');
      const password = sessionStorage.getItem('settings_password');
      if (!username || !password) {
        setError('You must be logged in to seed data');
        return;
      }

      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      const response = await fetch('/api/jointext/seed', {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to seed join text');
        return;
      }

      setSuccess('Join text seeded successfully!');
      setTimeout(() => setSuccess(''), 3000);

      await fetchJoinText();
    } catch (error) {
      console.error('Error seeding join text:', error);
      setError('Failed to seed join text. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Section management
  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      order: (joinText.sections || []).length,
      blocks: []
    };
    setJoinText(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  };

  const removeSection = (sectionId) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || [])
        .filter(s => s.id !== sectionId)
        .map((s, index) => ({ ...s, order: index }))
    }));
  };

  const moveSectionUp = (sectionId) => {
    setJoinText(prev => {
      const sections = [...(prev.sections || [])];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index <= 0) return prev;
      [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
      return {
        ...prev,
        sections: sections.map((s, i) => ({ ...s, order: i }))
      };
    });
  };

  const moveSectionDown = (sectionId) => {
    setJoinText(prev => {
      const sections = [...(prev.sections || [])];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index < 0 || index >= sections.length - 1) return prev;
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      return {
        ...prev,
        sections: sections.map((s, i) => ({ ...s, order: i }))
      };
    });
  };

  // Block management
  const addBlock = (sectionId, type = 'text', layout = 'full') => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        
        const newBlock = {
          id: `block-${Date.now()}`,
          order: (section.blocks || []).length,
          type,
          layout,
          title: '',
          ...(type === 'text' ? { content: '' } : {}),
          ...(type === 'list' ? { items: [''] } : {}),
          ...(type === 'contact' ? { discord: { label: '', url: '' }, email: { label: '', url: '' } } : {})
        };
        
        return {
          ...section,
          blocks: [...(section.blocks || []), newBlock]
        };
      })
    }));
  };

  const removeBlock = (sectionId, blockId) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || [])
            .filter(b => b.id !== blockId)
            .map((b, index) => ({ ...b, order: index }))
        };
      })
    }));
  };

  const updateBlock = (sectionId, blockId, updates) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          )
        };
      })
    }));
  };

  const updateListItem = (sectionId, blockId, itemIndex, value) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block => {
            if (block.id !== blockId) return block;
            const newItems = [...(block.items || [])];
            newItems[itemIndex] = value;
            return { ...block, items: newItems };
          })
        };
      })
    }));
  };

  const addListItem = (sectionId, blockId) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block => {
            if (block.id !== blockId) return block;
            return { ...block, items: [...(block.items || []), ''] };
          })
        };
      })
    }));
  };

  const removeListItem = (sectionId, blockId, itemIndex) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block => {
            if (block.id !== blockId) return block;
            return {
              ...block,
              items: (block.items || []).filter((_, i) => i !== itemIndex)
            };
          })
        };
      })
    }));
  };

  // Render block editor
  const renderBlockEditor = (section, block) => {
    return (
      <Card key={block.id} className="mb-4 border-2 border-primary">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">
              Block: {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-32">
                <Select
                  value={block.layout}
                  onValueChange={(value) => updateBlock(section.id, block.id, { layout: value })}
                >
                  <SelectTrigger aria-label="Layout">
                    <SelectValue placeholder="Layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="left">Left Half</SelectItem>
                    <SelectItem value="right">Right Half</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeBlock(section.id, block.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={block.title}
                onChange={(e) => updateBlock(section.id, block.id, { title: e.target.value })}
              />
            </div>

            {block.type === 'text' && (
              <div className="space-y-1.5">
                <Label>Content</Label>
                <Textarea
                  rows={4}
                  value={block.content}
                  onChange={(e) => updateBlock(section.id, block.id, { content: e.target.value })}
                />
              </div>
            )}

            {block.type === 'list' && (
              <div className="space-y-2">
                {(block.items || []).map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1 space-y-1.5">
                      <Label className="sr-only">{`Item ${index + 1}`}</Label>
                      <Input
                        value={item}
                        onChange={(e) => updateListItem(section.id, block.id, index, e.target.value)}
                        placeholder={`Item ${index + 1}`}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeListItem(section.id, block.id, index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem(section.id, block.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            )}

            {block.type === 'contact' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Discord</h4>
                  <div className="space-y-1.5">
                    <Label>Discord Label</Label>
                    <Input
                      value={block.discord?.label || ''}
                      onChange={(e) => updateBlock(section.id, block.id, {
                        discord: { ...block.discord, label: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Discord URL</Label>
                    <Input
                      value={block.discord?.url || ''}
                      onChange={(e) => updateBlock(section.id, block.id, {
                        discord: { ...block.discord, url: e.target.value }
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Email</h4>
                  <div className="space-y-1.5">
                    <Label>Email Label</Label>
                    <Input
                      value={block.email?.label || ''}
                      onChange={(e) => updateBlock(section.id, block.id, {
                        email: { ...block.email, label: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email URL</Label>
                    <Input
                      value={block.email?.url || ''}
                      onChange={(e) => updateBlock(section.id, block.id, {
                        email: { ...block.email, url: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render preview
  const renderPreview = (section, block) => {
    const widthClass = block.layout === 'full' ? 'w-full' : 'w-[calc(50%-0.5rem)]';
    
    return (
      <div 
        key={block.id}
        className={`${widthClass} p-4 border border-dashed border-white/20 rounded-md min-h-[100px] flex-grow-0`}
      >
        <h4 className="text-[#FFD700] text-md font-medium mb-2">
          {block.title || 'Untitled'}
        </h4>
        
        {block.type === 'text' && (
          <p className="text-sm">
            {block.content || 'No content yet...'}
          </p>
        )}
        
        {block.type === 'list' && (
          <ul className="pl-4 list-disc text-sm">
            {(block.items || []).map((item, i) => (
              <li key={i}>{item || 'Empty item'}</li>
            ))}
          </ul>
        )}
        
        {block.type === 'contact' && (
          <div className="text-sm space-y-1">
            {block.discord?.label && (
              <p>Discord: {block.discord.label}</p>
            )}
            {block.email?.label && (
              <p>Email: {block.email.label}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outline"
          onClick={handleSeedJoinText}
          disabled={saving}
        >
          Seed Example Data
        </Button>
        <Button
          variant="outline"
          onClick={addSection}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Hero Section Editor */}
      <div className="p-6 mb-8 rounded-lg border bg-primary/5">
        <h2 className="text-xl font-semibold mb-6">Hero Section</h2>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <Label>Hero Title</Label>
            <Input
              value={joinText.hero?.title || ''}
              onChange={(e) => setJoinText(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
            />
          </div>
          
          <div className="space-y-1.5">
            <Label>Hero Subtitle</Label>
            <Textarea
              rows={2}
              value={joinText.hero?.subtitle || ''}
              onChange={(e) => setJoinText(prev => ({
                ...prev,
                hero: { ...prev.hero, subtitle: e.target.value }
              }))}
            />
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <h3 className="text-md font-medium mb-4">Hero Badges</h3>
        <div className="space-y-4 mb-4">
          {(joinText.hero?.badges || []).map((badge, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="space-y-1.5 flex-[2]">
                <Label>{`Badge ${index + 1} Label`}</Label>
                <Input
                  value={badge.label}
                  onChange={(e) => {
                    const newBadges = [...(joinText.hero?.badges || [])];
                    newBadges[index] = { ...newBadges[index], label: e.target.value };
                    setJoinText(prev => ({
                      ...prev,
                      hero: { ...prev.hero, badges: newBadges }
                    }));
                  }}
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <Label>Color</Label>
                <Select
                  value={badge.color}
                  onValueChange={(value) => {
                    const newBadges = [...(joinText.hero?.badges || [])];
                    newBadges[index] = { ...newBadges[index], color: value };
                    setJoinText(prev => ({
                      ...prev,
                      hero: { ...prev.hero, badges: newBadges }
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newBadges = (joinText.hero?.badges || []).filter((_, i) => i !== index);
                  setJoinText(prev => ({
                    ...prev,
                    hero: { ...prev.hero, badges: newBadges }
                  }));
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 mb-0.5"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newBadges = [...(joinText.hero?.badges || []), { label: '', color: 'gold' }];
            setJoinText(prev => ({
              ...prev,
              hero: { ...prev.hero, badges: newBadges }
            }));
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Badge
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Content Sections</h2>

      {joinText.sections && joinText.sections.map((section, sectionIndex) => (
        <div key={section.id} className="p-6 mb-8 rounded-lg border bg-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Section {sectionIndex + 1}</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => moveSectionUp(section.id)} 
                disabled={sectionIndex === 0}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => moveSectionDown(section.id)} 
                disabled={sectionIndex === (joinText.sections || []).length - 1}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeSection(section.id)} 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Column */}
            <div>
              <h4 className="text-md font-medium mb-4">Editor</h4>
              
              {(section.blocks || []).map(block => renderBlockEditor(section, block))}
              
              {(!section.blocks || section.blocks.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    No blocks yet. Add one to get started.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(section.id, 'text', 'full')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(section.id, 'list', 'left')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(section.id, 'contact', 'full')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Preview Column */}
            <div>
              <h4 className="text-md font-medium mb-4">Live Preview</h4>
              <div className="p-4 rounded-lg bg-background border min-h-[200px]">
                {(!section.blocks || section.blocks.length === 0) ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Add blocks to see preview
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {(section.blocks || []).map(block => renderPreview(section, block))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {(!joinText.sections || joinText.sections.length === 0) && (
        <div className="p-12 text-center rounded-lg border bg-card">
          <h3 className="text-xl text-muted-foreground mb-6">
            No sections yet
          </h3>
          <Button
            onClick={addSection}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Section
          </Button>
        </div>
      )}
    </div>
  );
}
